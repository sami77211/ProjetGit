import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component'; // Ensure you import your AppComponent
import { DashboardComponent } from './dashboard/dashboard.component';


@NgModule({
  declarations: [
    AppComponent,
      ],
  imports: [
    BrowserModule,
    DashboardComponent
  ],
  providers: [],
  bootstrap: [AppComponent] // Bootstrap your AppComponent
})
export class AppModule { }
