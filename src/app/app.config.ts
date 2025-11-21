import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { providePrimeNG } from 'primeng/config';
import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

import { routes } from './app.routes';
import { provideFormlyCore } from '@ngx-formly/core';
import { withFormlyElvisFO } from './ui/elvisfo/ui-elvisfo.config';
import { provideHttpClient } from '@angular/common/http';
import { appInitializer } from './app.initializer';

const THEME_COLOR = 'slate';
// const THEME_COLOR = 'zinc';
// const THEME_COLOR = 'stone';

const MyPreset = definePreset(Aura, {
    semantic: {
      primary: {
        50: `{${THEME_COLOR}.50}`,
        100: `{${THEME_COLOR}.100}`,
        200: `{${THEME_COLOR}.200}`,
        300: `{${THEME_COLOR}.300}`,
        400: `{${THEME_COLOR}.400}`,
        500: `{${THEME_COLOR}.500}`,
        600: `{${THEME_COLOR}.600}`,
        700: `{${THEME_COLOR}.700}`,
        800: `{${THEME_COLOR}.800}`,
        900: `{${THEME_COLOR}.900}`,
        950: `{${THEME_COLOR}.950}`
      },
      colorScheme: {
        light: {
          
        },
        dark: {
            //...
        }
      }
    }
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: MyPreset,
        options: {
            darkModeSelector: false || 'none'
        }
      }
    }),
    provideFormlyCore(withFormlyElvisFO()),
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(),
    provideAppInitializer(() => appInitializer())
  ]
};

