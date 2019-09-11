class Map {
  constructor() {
    ymaps.ready(() => {
      this.addMap();
    });
  }

  addMap() {
    this.map = new ymaps.Map(document.querySelector('.contacts__map'), {
      center: [55.34969,86.10720],
      zoom: 17,
      controls: [],
    });

    this.map.behaviors.disable([
      // 'drag',
      // 'multiTouch',
    ]);

    const marker = new ymaps.Placemark([55.34969606936035,86.10520899999995]);
    this.map.geoObjects.add(marker);
  }
}

export default Map;
