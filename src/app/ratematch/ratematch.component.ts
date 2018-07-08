import { Component } from '@angular/core';
import { DataService } from '../services/data.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { INTERNAL_BROWSER_DYNAMIC_PLATFORM_PROVIDERS } from '@angular/platform-browser-dynamic/src/platform_providers';

@Component({
  selector: 'app-ratematch',
  templateUrl: './ratematch.component.html',
  styleUrls: ['./ratematch.component.css']
})
export class RatematchComponent {

  lineItems: LineItem[] = [];

  rates: Rate[] = [];
  locations: RLocation[] = [];
  criterias: RMC[] = [];

  errlineItem = "";
  addSuccess = null;
  states = [];
  zips = [];

  originForm: FormGroup;
  destForm: FormGroup;
  lineItemForm: FormGroup;
  lineItemSearch: FormGroup;
  origin = true;
  selectedOrigin: RLocation = null;
  selectedDest: RLocation = null;
  results: ResultI[] = [];
  filteredRes: ResultI[] = [
    // {
    //   calctype: "QUANTITY",
    //   carriername: "B Chomsky",
    //   price: 10
    // },
    // {
    //   calctype: "QUANTITY",
    //   carriername: "Z Foorder",
    //   price: 5
    // }
  ];

  constructor(private dataService: DataService, private fb: FormBuilder) {
    this.dataService.getRates().subscribe(
      data => this.rates = data
    )
    this.dataService.getLocations().subscribe(
      data => this.locations = data,
      err => console.log(err),
      () => {
        for (let loc of this.locations) {
          this.states.push("" + loc.state);
        }
        this.states = Array.from(new Set(this.states));
      }
    )
    this.dataService.getMatchCrits().subscribe(
      data => this.criterias = data
    )
    this.createForm();
  }

  createForm() {
    this.originForm = this.fb.group({
      state: [''],
      zip: ['']
    });
    this.destForm = this.fb.group({
      state: [''],
      zip: ['']
    });
    this.lineItemForm = this.fb.group({
      quantity: 1,
      dimensions: this.fb.group({
        l: 1,
        w: 1,
        h: 1,
      }),
      weight: 1,
      packtype: 'Box',
    });
    this.lineItemSearch = this.fb.group({
      squery: '',
      selectSort: 1
    });
  }

  getZips() {
    this.zips = [];
    let currentState = null;
    if (this.originForm.get('state').dirty) {
      this.origin = true;
      currentState = this.originForm.get('state').value;
      this.originForm.get('state').markAsPristine();
      this.selectedDest = null;
    }
    else if (this.destForm.get('state').dirty) {
      this.origin = false;
      currentState = this.destForm.get('state').value;
      this.destForm.get('state').markAsPristine();
      this.selectedOrigin = null;
    }
    this.zips = this.locations.filter(loc => loc.state == currentState).map(loc => loc.city + "|" + loc.postal_code);
  }

  setOrigin() {
    let currentZip = this.originForm.get('zip').value.split("|")[1];
    this.selectedOrigin = this.locations.find(x => x.postal_code == currentZip);
    this.selectedDest = null;
  }
  setDest() {
    let currentZip = this.destForm.get('zip').value.split("|")[1];
    this.selectedDest = this.locations.find(x => x.postal_code == currentZip);
    this.selectedOrigin = null;
  }

  addItem() {
    if (this.lineItemForm.valid) {
      this.errlineItem = "";
      let li = {
        quantity: 0,
        dimensions: {
          l: 0,
          w: 0,
          h: 0,
        },
        weight: 1,
        packtype: '',
      };

      li['quantity'] = this.lineItemForm.get('quantity').value;
      li['dimensions']['l'] = this.lineItemForm.get('dimensions.l').value;
      li['dimensions']['h'] = this.lineItemForm.get('dimensions.h').value;
      li['dimensions']['w'] = this.lineItemForm.get('dimensions.w').value;
      li['packtype'] = this.lineItemForm.get('packtype').value;
      li['weight'] = this.lineItemForm.get('weight').value;
      if (li.quantity > 0 && li.dimensions.l > 0 && li.dimensions.h > 0 && li.dimensions.w > 0 && li.weight > 0) {
        this.lineItems.push(li);
        this.addSuccess = "Added successfully!";
        setTimeout(() => {
          this.addSuccess = null;
        }, 1000);
        return;
      }
    }
    this.errlineItem = "Please check all the details.";
    this.addSuccess = null;
  }

  removeItem() {
    if (this.lineItems.length > 0) {
      this.lineItems.pop();
    }
  }

  genRes() {
    let selected: RLocation = null;
    if (this.selectedDest) {
      selected = this.selectedDest;
    }
    else {
      selected = this.selectedOrigin;
    }
    let res: Rate[] = this.criterias.filter(
      cri => cri.postal_code == selected.postal_code
    ).map(cri => cri.rate_id).map(cri => this.rates.filter(rate => rate.id == cri)[0]);
    if (this.lineItems.length > 0) {
      this.errlineItem = null;
      let quantity = this.lineItems.map(x => x.quantity).reduce(this.redSum, 0);
      let weight = this.lineItems.map(x => x.weight).reduce(this.redSum, 0);
      this.results = res.map(x => this.getPrice(x, quantity, weight));
      this.filteredRes = this.results.sort(this.cmprRate);
      this.reSort();
    }
    else {
      this.errlineItem = "Please enter some line items.";
    }

  }

  cmprRate(x: ResultI, y: ResultI) {
    return x.price - y.price;
  }

  redSum(a, b) {
    return a + b;
  }

  getPrice(r: Rate, q: number, w: number): ResultI {
    if (r.calculation_type.startsWith("QU")) {
      return {
        carriername: r.carrier_name,
        price: parseFloat((r.rate * q).toPrecision(3)),
        calctype: r.calculation_type
      }
    }
    else {
      return {
        carriername: r.carrier_name,
        price: parseFloat((r.rate * w * q).toPrecision(3)),
        calctype: r.calculation_type
      }
    }
  }

  searchItems() {
    let query = this.lineItemSearch.get('squery').value;
    this.filteredRes = this.results.filter(x => x.carriername.toLowerCase().indexOf(query) >= 0);
  }
  reSort() {
    let opt = parseInt(this.lineItemSearch.get('selectSort').value);
    switch (opt) {
      case 1: this.filteredRes.sort((x, y) => (x.carriername > y.carriername ? 1 : -1)); break;
      case 2: this.filteredRes.sort(this.cmprRate); break;
      default: break;
    }
  }

}

export interface ResultI {
  carriername: string;
  price: number;
  calctype: string;
}
export interface Rate {
  id: number;
  carrier_name: string;
  rate: number;
  calculation_type: string;
}

export interface RMC {
  rate_id: number;
  postal_code: number;
  city: string;
  state: string;
}
export interface RLocation {
  id: number;
  postal_code: number;
  city: string;
  state: string;
}
export interface LineItem {
  quantity: number;
  dimensions: {
    l: number;
    w: number;
    h: number;
  }
  weight: number;
  packtype: string;
}