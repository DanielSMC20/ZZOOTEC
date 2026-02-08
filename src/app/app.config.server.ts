import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { appConfig } from './app.config';
import { provideHttpClient } from '@angular/common/http';


const serverConfig: ApplicationConfig = {
  providers: [
        provideRouter(routes),
        provideHttpClient()
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
