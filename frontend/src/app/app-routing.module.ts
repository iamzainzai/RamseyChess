import { NgModule } from '@angular/core';
import { RouterModule, Routes, ExtraOptions } from '@angular/router';
import { MainpageComponent } from './sandbox-page/mainpage/mainpage.component';
import { BlogComponent } from './blog-page/blog.component';

const routerOptions: ExtraOptions = {
  anchorScrolling: 'enabled', 
  scrollPositionRestoration: 'enabled', 
};

const routes: Routes = [
  { path: '', redirectTo: 'mainpage', pathMatch: 'full' },
  { path: 'mainpage', component: MainpageComponent },
  { path: 'blog', component: BlogComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, routerOptions)], 
  exports: [RouterModule],
})
export class AppRoutingModule { }
