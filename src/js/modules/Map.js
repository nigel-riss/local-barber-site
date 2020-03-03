class Map {
  constructor() {
    ymaps.ready(() => {
      this.addMap();
    });
  }

  addMap() {
    this.map = new ymaps.Map(document.querySelector('.contacts__map'), {
      center: [55.3487582,86.09],
      zoom: 17,
      controls: [],
    });

    this.map.behaviors.disable([
      // 'drag',
      // 'multiTouch',
    ]);

    const marker = new ymaps.Placemark([55.3487582,86.0875]);
    this.map.geoObjects.add(marker);
  }
}

export default Map;
