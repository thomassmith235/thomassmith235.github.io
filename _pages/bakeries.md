---
layout: splash
title: "Bakery List"
permalink: /bakeries/
---

<style>
  .bakery.list {
    display: grid;
    gap: 20px;
  }
  @media (max-width: 768px) {
    .bakery.list {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  @media (min-width: 769px) {
    .bakery.list {
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    }
  }
  .bakery-tile {
    padding: 10px; /* Add padding to make the border wider */
    width: 270px; /* Ensure the tile is wider than the image */
    border: 1px solid #ddd;
    box-sizing: border-box; /* Include padding in the width calculation */
  }
  .bakery-tile img {
    width: 250px;
    height: 250px;
    object-fit: cover;
    margin-bottom: 5px;
  }
</style>

## North London

<div class="bakery list" style="font-size: 0.9em;">
  <div class="bakery-tile">
    <img src="/assets/images/breadbybike.jpg" alt="Bakery Image">
    <h3 style="font-size: 1.1em;">Bread By Bike</h3>
    <h3 style="font-size: 1.1em;"><a href="https://breadbybike.com" target="_blank">breadbybike.com</a></h3>
  </div>

  <div class="bakery-tile">
    <h3 style="font-size: 1.1em;">Jolene Hornsey Road</h3>
    <p style="font-size: 0.9em;">Famous for its buttery croissants.</p>
  </div>
  <div class="bakery-tile">
    <h3 style="font-size: 1.1em;">Bakery C</h3>
    <p style="font-size: 0.9em;">Specializes in gluten-free treats.</p>
  </div>
</div>

## East London

<div class="bakery list" style="font-size: 0.9em;">
  <div class="bakery-tile">
    <img src="/assets/images/fabriquebakery.jpg" alt="Bakery Image">
    <h3 style="font-size: 1.1em;">Fabrique Bakery </h3>
    <h3 style="font-size: 1.1em;"><a href="https://fabriquebakery.com" target="_blank">fabriquebakery.com</a></h3>
  </div>
  
   <div class="bakery-tile">
    <img src="/assets/images/e5bakehouse.jpg" alt="Bakery Image">
    <h3 style="font-size: 1.1em;">e5 Bakehouse </h3>
    <h3 style="font-size: 1.1em;"><a href="https://e5bakehouse.com" target="_blank">e5bakehouse.com</a></h3>
  </div>
  
  <div class="bakery-tile">
    <img src="/assets/images/pophamseast.jpg" alt="Bakery Image">
    <h3 style="font-size: 1.1em;">Pophams Bakery </h3>
    <h3 style="font-size: 1.1em;"><a href="https://pophamsbakery.com" target="_blank">pophamsbakery.com</a></h3>
  </div>
</div>

## South London

<div class="bakery list" style="font-size: 0.9em;">
  <div class="bakery-tile">
    <img src="/assets/images/erics.jpg" alt="Bakery Image">
    <h3 style="font-size: 1.1em;">Eric's</h3>
    <h3 style="font-size: 1.1em;"><a href="https://www.ericslondon.com" target="_blank">ericslondon.com</a></h3>
  </div>

  <div class="bakery-tile">
    <img src="/assets/images/irene.jpg" alt="Bakery Image">
    <h3 style="font-size: 1.1em;">IRENE</h3>
    <h3 style="font-size: 1.1em;"><a href="https://www.irenebakery.co.uk/"
    target="_blank">irenebakery.co.uk/</a></h3>
  </div>

  <div class="bakery-tile">
    <h3 style="font-size: 1.1em;">Flour & Bean</h3>
    <p style="font-size: 0.9em;">Family-run spot in Clapham with fantastic sourdough.</p>
  </div>
</div>
