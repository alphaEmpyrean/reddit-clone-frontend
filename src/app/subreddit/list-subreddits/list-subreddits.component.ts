import { Component, OnInit } from '@angular/core';
import { SubredditModel } from '../subreddit-response';
import { SubredditService } from '../subreddit.service';

@Component({
  selector: 'app-list-subreddits',
  templateUrl: './list-subreddits.component.html',
  styleUrls: ['./list-subreddits.component.css']
})
export class ListSubredditsComponent implements OnInit {

  subreddits!: Array<SubredditModel>;
  
  constructor(private subredditService: SubredditService) { }

  ngOnInit(): void {
    this.subredditService.getAllSubredits().subscribe({
      next: (data) => { this.subreddits = data },
      error: () => { new Error('Error getting all subreddits') }      
    })
  }

}
