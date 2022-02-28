import React, { useState, useCallback } from 'react';
import { render } from 'react-dom';
import { useModal } from 'react-hooks-use-modal';
import FileUpdate from './FileUpdate';
import styled from 'styled-components';
import './modal.css';
import { Boton } from './Form';

//const FilaApp =AppFile();

export const AppDialogUpload = () => {
    const [Modal, open, close, isOpen] = useModal('root', {
      preventScroll: true,
      closeOnOverlayClick: false
    });

    return (
      <div>
     
        <button onClick={open}>Importar Aspirantes</button>
        <Modal>
         
           <div className='modal-main'>
            <ul>
            <h1>Carga de Aspirantes</h1>
        
            <FileUpdate/>
            <Boton onClick={close}>CLOSE</Boton>
            </ul>
          </div>
         
        </Modal>
      </div>
    );
  };


 
  render(<AppDialogUpload/>, document.getElementById('root'));