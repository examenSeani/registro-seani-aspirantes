import React, {useContext, useState, useCallback } from 'react';
import styled from 'styled-components';
import {ContextAdmin} from '../context/AdminContextRegister';

import { useModal } from 'react-hooks-use-modal';

import { AppDialogUpload, AppUpload } from './AppDialogUpload';
import FileUpdate from './FileUpdate';



const Header = () => {

    const{registroAdmin ,changeRegistroAdmin}=useContext(ContextAdmin);

    const activeAdminForm = () => {
        changeRegistroAdmin(!registroAdmin);
    }

    const [Modal, open, close, isOpen] = useModal('root', {
        preventScroll: true,
        closeOnOverlayClick: false
      });


    return (  
        <HeaderNav>
            
            <header>
                {
                    registroAdmin === true ?
                        <h2>Registro de administradores</h2>
                    :
                        <h2>Registro de aspirantes</h2>
                }
                <ul>
                    <li><a href="">SEANI</a></li>

                    <ul>
                        <li><button onClick={()=>activeAdminForm()}>Administradores / Aspirantes</button></li>
                     
                        <li>

                  
                 
                  <AppDialogUpload>
                        <FileUpdate></FileUpdate>
                 
                  </AppDialogUpload>

                  
     
   

                        </li>

                        
                    </ul>


                    <li><a href="">Administrador</a></li>
                </ul>
            </header>
        </HeaderNav>
    );
}

const HeaderNav = styled.div`
    width: 100%;
    background: #008b2a;
    color: #fff;
    header{
        width: 100%;
        padding: 8px 0px 0px 0px;
        h2{
            text-align: center;
            margin: 12px 0px;
        }
        ul{
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #ff7b00;
            li{
                
                list-style: none;
                padding: 5px 15px;
                :hover{
                    background: teal;
                }
                button{
                    background: teal;
                    color: #fff;
                    border: none;
                    padding: 8px;
                    border-radius: 8px;
                    &:hover{
                        cursor: pointer;
                    }
                }
                a{
                    display: inline-block;
                    width: 100%;
                    text-decoration: none;
                    color: #fff;
                    width: 100%;
                }
            }
        }
    }
`;

export default Header;