import { Routes } from '@angular/router';

import { WorkspaceComponent } from './components/workspace/workspace.component';
import { QuickViewComponent } from './components/workspace/output-container/quick-view/quick-view.component';
import { SearchComponent } from './components/workspace/output-container/search/search.component';
import { ComparespaceComponent } from './components/comparespace/comparespace.component';
import { StandardComponent } from './components/workspace/output-container/standard/standard.component';

export const appRoutes: Routes = [
    {
        path: 'workspace/:id',
        component: WorkspaceComponent,
        children: [
            {
                path: 'quick',
                component: QuickViewComponent
            },
            {
                path: 'search',
                component: SearchComponent
            },
            {
                path: 'standard',
                component: StandardComponent
            }
        ]
    },
    {
        path: 'workspace',
        redirectTo: '/workspace/0/standard'
    },
    {
        path: 'compare',
        component: ComparespaceComponent
    },
    {
        path: '',
        redirectTo: '/workspace/0/standard',
        pathMatch: 'full'
    },
    {
        path: '**',
        redirectTo: '/workspace/0/standard'
    }
];