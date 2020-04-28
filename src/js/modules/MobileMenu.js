class MobileMenu {
    constructor () {
        this.menuButton = document.querySelector('.menu-button');
        this.mainNav = document.querySelector('.header__nav');

        if (this.menuButton && this.mainNav) {
            this.resetMenu();
            this.addEventListeners();
        }
    }

    addEventListeners () {
        this.menuButton.addEventListener('click', () => {
            this.toggleMenu();
        });

        document.addEventListener('click', (evt) => {
            if (evt.target.parentNode.classList.contains('main-nav__item')) {
                this.toggleMenu();
            }
        });
    }

    resetMenu() {
        this.menuButton.classList.remove('menu-button--x-close');
        this.mainNav.classList.remove('header__nav--open');
    }

    toggleMenu () {
        this.menuButton.classList.toggle('menu-button--x-close');
        this.mainNav.classList.toggle('header__nav--open');
    }
}

export default MobileMenu;
