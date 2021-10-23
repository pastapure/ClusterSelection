import React, { useEffect, useRef } from "react";
import "ol/ol.css";

import Feature from 'ol/Feature';
import Map from 'ol/Map';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Select from 'ol/interaction/Select';
import View from 'ol/View';
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style';
import {LineString, Point} from 'ol/geom';
//import {getVectorContext} from 'ol/render';
import TileLayer from "ol/layer/Tile";
import { fromLonLat } from "ol/proj";
import OSM from "ol/source/OSM";

export default () => {

  const mapRef = useRef();
  useEffect(() => {
     const map=new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM()
        }),BuildingsVector,WorkorderVector
      ],
      view: new View({
        center: fromLonLat([77.2, 15]),
        zoom:6.3
      })
    });

    map.addInteraction(select);
    // map.on('click', function (evt) {

    // });

     
    //map.render();
  });

const styles = {
  '10': new Style({
    image: new CircleStyle({
      radius: 5,
      
      fill: new Fill({color: '#666666'}),
      stroke: new Stroke({color: '#bada55', width: 1}),
    }),
  }),
  '20': new Style({
    image: new CircleStyle({
      radius: 10,
      zIndex: 5,
      fill: new Fill({color: 'red'}),
      stroke: new Stroke({color: '#bada55', width: 1}),
    }),
  }),
};

const count = 20;
const features = new Array(count);

for (let i = 0; i < count; ++i) {
 const Xdiff=Math.floor(Math.random()*(3)+77)
 const Ydiff=Math.floor(Math.random()*(10)+10);
  features[i] = new Feature({
    'geometry': new Point(fromLonLat([Xdiff,Ydiff])),
    'i': i,
    'size':  20,
  });
}

const BuildingsSource = new VectorSource({
  features: features,
  wrapX: false,
});

const BuildingsVector = new VectorLayer({
  source: BuildingsSource,
  style: function (feature) {
    return styles[feature.get('size')];
  },
});

const select = new Select();

select.on('select', function (e) 
{
  WorkorderSource.clear()
  if(e.selected[0]!=null) 
  {
        //console.log(e.target)
        //console.log(e.selected[0].getGeometry().getCoordinates())
        const coordinate = e.selected[0].getGeometry().getCoordinates()
        const p= new Point(coordinate).transform('EPSG:3857', 'EPSG:4326') 
        const cords= p.getCoordinates();         
        const count=Math.floor(Math.random() * 6) + 3;

        for (let i = 0; i < count; ++i) {
        const dx = cords[0] - (cords[0]+0.5);
        const dy = cords[1] - (cords[1]+0.5);
        const radius = Math.sqrt(dx * dx + dy * dy);
        const rotation = Math.atan2(dy, dx);
        const angle = rotation + i * 2 * Math.PI / count;
        //const fraction = i % 2 === 0 ? 1 : 0.5;
        const offsetX = radius  * Math.cos(angle);
        const offsetY = radius  * Math.sin(angle);
        const f = new Feature({'geometry': new Point(fromLonLat([cords[0] +offsetX, cords[1]+offsetY ]))  });
                //console.log(f)        
        WorkorderSource.addFeature(f);
        const geometry = f.getGeometry().getCoordinates();
        const lf = new Feature({'geometry': new LineString([coordinate, geometry]) });
        WorkorderSource.addFeature(lf);
      }
  }
  else
  {
     WorkorderSource.clear()
  }
});

const Wofeatures = [];

const WorkorderSource = new VectorSource({
  features: Wofeatures,
  wrapX: false,
});
        
const WorkorderVector = new VectorLayer({
  source: WorkorderSource,
  style: function (feature) {
    return new Style({
          stroke: new Stroke({color: 'blue', width: 1, }),
          image: new CircleStyle({
            radius: 10,
            fill: new Fill({color: 'black'}),
            stroke: new Stroke({color: 'green', width: 3, }),
          }),
        });
  },
});

  return <div className="map" ref={mapRef} />;
};