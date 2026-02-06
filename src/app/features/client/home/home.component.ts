import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  signatureServices = [
    {
      name: 'Body Sculpting & Contouring',
      description: 'Transform your body with our advanced non-invasive sculpting treatments designed to target stubborn fat and enhance your natural curves.',
      image: 'https://images.unsplash.com/photo-1519824145371-296894a0daa9?w=600'
    },
    {
      name: 'Clinical Facial Treatments',
      description: 'Experience medical-grade facials that deliver visible results. Our expert therapists customize each treatment to your unique skin needs.',
      image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600'
    }
  ];

  topTreatments = [
    { name: 'Dermapen Therapy and Body Contouring Bundle', price: 'R900.00', image: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=400' },
    { name: 'Ultimate Face & Body Rejuvenation Combo', price: 'R800.00', image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400' },
    { name: 'Intense Mark Specialty Treatment', price: 'R780.00 – R980.00', image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=400' },
    { name: 'Skin Consultation', price: 'FREE', image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400' },
    { name: 'Microneedling', price: 'R700.00', image: 'https://images.unsplash.com/photo-1583001308902-37fa7f71cd5d?w=400' },
    { name: 'Luxury Dermaplaning Session', price: 'R650.00', image: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400' },
    { name: 'HydraFacial', price: 'R600.00', image: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=400' },
    { name: 'Ionic Foot Detox + Infrared Sauna Session', price: 'R600.00', image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400' }
  ];
}