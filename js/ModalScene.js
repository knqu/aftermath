import Modal from './Modal.js';

export default class ModalScene extends Phaser.Scene {
    constructor() {
        super({ key: 'ModalScene' });
    }

    init(data) {
        this.message = data.message;
    }

    create() {
        new Modal(this, this.message);
    }
}
