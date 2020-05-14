import {
     transition,
     trigger,
     query,
     style,
     animate,
     group
} from '@angular/animations';

export const slideInAnimation =
     trigger('routeAnimations', [
          transition('* => Home', [
               query(':enter, :leave', [
                    style({
                         position: 'absolute',
                         top: 0,
                         left: 0,
                         width: '100%'
                    })
               ], { optional: true }),
               query(':enter', [
                    style({ left: '-100%' })
               ]),
               group([
                    query(':leave', [
                         animate('600ms ease', style({ left: '100%' }))
                    ], { optional: true }),
                    query(':enter', [
                         animate('600ms ease', style({ left: '0%' }))
                    ])
               ]),
          ]),
          transition('* => Editor', [
               query(':enter, :leave', [
                    style({
                         position: 'absolute',
                         top: 0,
                         right: 0,
                         width: '100%'
                    })
               ], { optional: true }),
               query(':enter', [
                    style({ right: '-100%' })
               ]),
               group([
                    query(':leave', [
                         animate('600ms ease', style({ right: '100%' }))
                    ], { optional: true }),
                    query(':enter', [
                         animate('600ms ease', style({ right: '0%' }))
                    ])
               ]),
          ]),
          transition('Editor => *', [
               query(':enter, :leave', [
                    style({
                         position: 'absolute',
                         top: 0,
                         left: 0,
                         width: '100%'
                    })
               ], { optional: true }),
               query(':enter', [
                    style({ left: '-100%' })
               ]),
               group([
                    query(':leave', [
                         animate('600ms ease', style({ left: '100%' }))
                    ], { optional: true }),
                    query(':enter', [
                         animate('600ms ease', style({ left: '0%' }))
                    ])
               ]),
          ]),
          transition('Home => *', [
               query(':enter, :leave', [
                    style({
                         position: 'absolute',
                         top: 0,
                         right: 0,
                         width: '100%'
                    })
               ], { optional: true }),
               query(':enter', [
                    style({ right: '-100%' })
               ]),
               group([
                    query(':leave', [
                         animate('600ms ease', style({ right: '100%' }))
                    ], { optional: true }),
                    query(':enter', [
                         animate('600ms ease', style({ right: '0%' }))
                    ])
               ]),
          ])
     ]);
