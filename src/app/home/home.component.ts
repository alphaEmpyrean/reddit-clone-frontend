import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PostModel } from '../shared/post-model';
import { PostService } from '../shared/post.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  posts$: Array<PostModel> = [];   
  
  constructor(private postService: PostService, private router: Router) {
    this.postService.getAllPosts().subscribe(responsePosts => {
    this.posts$ = responsePosts;})
  }

  ngOnInit(): void {
  }

}
