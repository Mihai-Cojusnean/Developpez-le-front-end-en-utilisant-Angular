import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { HeaderComponent } from './pages/page-layout/header/header.component';
import {NgxChartsModule} from "@swimlane/ngx-charts";

@NgModule({
  declarations: [AppComponent, HomeComponent, NotFoundComponent, HeaderComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, NgxChartsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
