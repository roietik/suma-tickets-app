import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {HttpClientModule} from '@angular/common/http';
import {ComponentsModule} from './components/components.module';
import {AppRoutingModule} from './app-routing.module';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {MatSlideToggle} from '@angular/material/slide-toggle';
import {MatIcon} from '@angular/material/icon';
import {MatFabButton} from '@angular/material/button';
import {
  MatCard,
  MatCardContent,
  MatCardFooter,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle
} from '@angular/material/card';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ComponentsModule,
    MatSlideToggle,
    MatIcon,
    MatFabButton,
    MatCard,
    MatCardTitle,
    MatCardContent,
    MatCardHeader,
    MatCardFooter,
    MatCardSubtitle
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {}