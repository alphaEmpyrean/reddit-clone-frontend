import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import { throwError } from 'rxjs';
import { CommentPayload } from 'src/app/comment/comment-payload';
import { CommentService } from 'src/app/comment/comment.service';
import { PostModel } from 'src/app/shared/post-model';
import { PostService } from 'src/app/shared/post.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  name!: string;
  posts!: PostModel[];
  comments!: CommentPayload[];
  postLength!: number;
  commentLength!: number;

  constructor(private activatedRoute: ActivatedRoute, private postService: PostService,
    private commentService: CommentService) {  
  }

  ngOnInit(): void {

    this.name = this.activatedRoute.snapshot.params['username'];
    
    this.postService.getAllPostsByUser(this.name).subscribe({
      next: (data) => { 
        this.posts = data;
        this.postLength = data.length;
      },
      error: (error) => { throwError(() => new Error(error)); }
    });

    this.commentService.getAllCommentsByUser(this.name).subscribe({
      next: (data) => { 
        this.comments = data;
        this.commentLength = data.length;
      },
      error: (error) => { throwError(() => new Error(error)); }
    })
  }

}
