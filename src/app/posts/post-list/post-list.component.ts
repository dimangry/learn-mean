import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Post } from '../post.model';
import { PostService } from '../post.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';

@Component({
    selector: 'app-post-list',
    templateUrl: './post-list.component.html',
    styleUrls: ['./post-list.component.css']
})

export class PostListComponent implements OnInit, OnDestroy {
    posts: Post[] = [];
    private postsSub: Subscription;
    isLoading = false;
    totalPosts = 0;
    postsPerPage = 2;
    currentPage = 1;
    pageSizeOptions = [1, 2, 5, 10];

    constructor(public postsService: PostService) {
    }

    ngOnInit() {
        this.isLoading = true;
        this.postsService.getPosts(this.postsPerPage, this.currentPage);
        this.postsSub = this.postsService.getPostUpdateListener()
            .subscribe((postData: {posts: Post[], postCount: number}) => {
                this.isLoading = false;
                this.totalPosts = postData.postCount;
                this.posts = postData.posts;
            });
    }

    onDelete(id: string) {
        this.postsService.deletePost(id).subscribe(() => {
          this.postsService.getPosts(this.postsPerPage, this.currentPage);
        });
    }

    ngOnDestroy() {
        this.postsSub.unsubscribe();
    }

    onChangedPage(pageData: PageEvent) {
        console.log(pageData);
        this.currentPage = pageData.pageIndex + 1;
        this.postsPerPage = pageData.pageSize;
        this.postsService.getPosts(this.postsPerPage, this.currentPage);
    }
}
