const Modal={
    open(){ //Abre o modal e adicionar a class ao modal
        document.querySelector('.modal-overlay').classList.add('active');
    },

    close(){ //Fecha o modal e remove active do modal
        document.querySelector('.modal-overlay').classList.remove('active')
    }
}