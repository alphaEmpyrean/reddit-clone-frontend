import { Component, Input, OnInit } from '@angular/core';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';
import { throwError } from 'rxjs';
import { AuthService } from 'src/app/auth/shared/auth.service';
import { PostModel } from '../post-model';
import { PostService } from '../post.service';
import { VoteService } from '../vote.service';
import { VotePayload } from './vote-payload';
import { VoteType } from './vote-type';

@Component({
  selector: 'app-vote-button',
  templateUrl: './vote-button.component.html',
  styleUrls: ['./vote-button.component.css']
})
export class VoteButtonComponent implements OnInit {

  @Input()
  post!: PostModel;

  votePayload!: VotePayload;
  faArrowUp = faArrowUp;
  faArrowDown = faArrowDown;
  upvoteColor!: string;
  downvoteColor!: string;
  isLoggedIn!: boolean;

  constructor(private postService: PostService,
    private authService: AuthService,
    private voteService: VoteService, 
    private toastr: ToastrService) { 
      this.votePayload = {
        voteType: undefined,
        postId: undefined
      }
    }

  ngOnInit(): void {    
  }

  upvotePost() {
    this.votePayload.voteType = VoteType.UPVOTE;
    this.vote();
    this.downvoteColor = '';
  }

  downvotePost() {
    this.votePayload.voteType = VoteType.DOWNVOTE;
    this.vote();
    this.upvoteColor = '';
  }

  private vote() {
    this.votePayload.postId = this.post.id;
    this.voteService.vote(this.votePayload).subscribe({
      next: (data) => { this.updateVoteDetails(); },
      error: (error) => {
        this.toastr.error(error.error.message);
        throwError(() => new Error(error));
      }});
  }

  private updateVoteDetails() {
    this.postService.getPost(this.post.id).subscribe({
      next: (data) => { this.post = data; }});
  }

}
