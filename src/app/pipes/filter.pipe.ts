import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterClients',
  standalone: true
})
export class FilterClientsPipe implements PipeTransform {
  transform(value: any[], arg: string): any[] {
   const resultClients: any[] = [];
    for(const client of value){
      if(client.email.indexOf(arg) > -1){
          resultClients.push(client)
      }
    }
    return resultClients;
  }
}
