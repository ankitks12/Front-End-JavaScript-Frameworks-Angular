import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { switchMap } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Comment } from '../shared/comment';
import { visibility, flyInOut, expand } from '../animations/app.animation';
import { from } from 'rxjs';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
  },
  animations: [
    flyInOut(),
    visibility(),
    expand()
  ]
})
export class DishdetailComponent implements OnInit {

  dish : Dish;
  errMess: string;
  dishIds: string[];
  prev: string;
  next: string;

  commentForm: FormGroup;
  cmt: Comment;
  dishcopy: Dish;
  visibility = 'shown';

  @ViewChild('fform') feedbackFormDirective;

  formErrors = {
    'author': '',
    'comment': ''
  };

  validationMessages = {
    'author': {
      'required': 'Name is required.',
      'minlength': 'Name must be atleast 2 characters long',
      'maxlength': 'Name cannot be more than 25 characters long'
    },
    'comment' : {
      'required': 'Comment is required'
    }
  };

  constructor(private dishService : DishService,
    private route: ActivatedRoute,
    private location : Location,
    private cb: FormBuilder,
    @Inject('BaseURL') private baseURL) { 
      this.createForm();
    }

  ngOnInit() {
    this.dishService.getDishIds().subscribe(dishIds => this.dishIds = dishIds);
    this.route.params.pipe(switchMap((params: Params) => { this.visibility = 'hidden'; return this.dishService.getDish(params['id']);}))
    .subscribe(dish => { this.dish = dish; this.dishcopy = dish; this.setPrevNext(dish.id); this.visibility = 'shown'; }, errmess => this.errMess = <any>errmess);
  }

  setPrevNext(dishId : string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }

  goBack() : void {
    this.location.back();
  }

  createForm() {
    this.commentForm = this.cb.group({
      rating: '5',
      author : ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      comment: ['', Validators.required],
      date: new Date().toISOString()
    });

    this.commentForm.valueChanges.subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); // (re)set form validation messages
  }

  onValueChanged(data?: any) {
    if(!this.commentForm) { return; }
    const form = this.commentForm;
    for(const field in this.formErrors) {
      if(this.formErrors.hasOwnProperty(field)){
        // clear previous error messages (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if(control && control.dirty && !control.valid){
          const messages = this.validationMessages[field];
          for(const key in control.errors){
            if(control.errors.hasOwnProperty(key)){
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  rating:number;

  onSubmit() {
    var d = new Date();
    var da = d.toISOString();
    this.commentForm.value.date = da;
    this.commentForm.value.rating = this.rating;
    this.cmt = this.commentForm.value;
    console.log(this.cmt);
    this.dishcopy.comments.push(this.commentForm.value);
    this.dishService.putDish(this.dishcopy)
      .subscribe(dish => {
        this.dish = dish; this.dishcopy = dish;
      },
      errmess => {this.dish = null; this.dishcopy = null; this.errMess = <any>errmess; });
    this.commentForm.reset({
      rating: '5',
      author: '',
      comment: '',
      date: ''
    });
    this.feedbackFormDirective.resetForm();
  }

  pitch(event: any) {
    this.rating = event.value;
  }
}