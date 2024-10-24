import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxChessBoardModule } from 'ngx-chess-board';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { HttpClientModule } from '@angular/common/http';



import { AppComponent } from './app.component';
import { MainpageComponent } from './sandbox-page/mainpage/mainpage.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { MatevalComponent } from './sandbox-page/mateval/mateval.component';
import { MinimaxComponent } from './sandbox-page/minimax/minimax.component';
import { BlogComponent } from './blog-page/blog.component';
import { NavmenuComponent } from './navmenu/navmenu.component';

@NgModule({
  declarations: [
    AppComponent,
    MainpageComponent,
    SidebarComponent,
    MatevalComponent,
    MinimaxComponent,
    BlogComponent,
    NavmenuComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    NgxChessBoardModule.forRoot(),
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
