import { connect } from "rxjs";

export const environment = {
    production: false,
    apiUrl: 'http://localhost:3000/',
    allowedDomains: ['localhost:3000'],
    disallowedRoutes: ['http://localhost:3000/login', 'http://localhost:3000/register'],
    }
  ;
  