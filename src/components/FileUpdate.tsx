import Papa from 'papaparse';
import React, { CSSProperties, useContext } from 'react';
import { useCSVReader } from 'react-papaparse';
import "firebase/auth";
import firebase from '../utils/firebase';
import { ContextRegistro } from '../context/registroContext';
import "firebase/firestore";

const db = firebase.firestore();

const styles = {
  csvReader: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 10,
  } as CSSProperties,
  browseFile: {
    width: '20%',
  } as CSSProperties,
  acceptedFile: {
    border: '1px solid #ccc',
    height: 45,
    lineHeight: 2.5,
    paddingLeft: 10,
    width: '80%',
  } as CSSProperties,
  remove: {
    borderRadius: 0,
    padding: '0 20px',
  } as CSSProperties,
  progressBarBackgroundColor: {
    backgroundColor: 'red',
  } as CSSProperties,
};


var numeroPreguntas = 90;
var textoCvs: any;

var filas = " , ".split(',');
var i = -1;

var erroresImportacion: any;
export default function CSVReader() {


  const { test, logico, matematico, lengua } = useContext(ContextRegistro);

  const sendVerificationEmail = (firebase: any, email: string, username: string) => {
    firebase
      .auth()
      .currentUser.sendEmailVerification()
      .then((res: any) => {
        console.log(res);
        console.log("Correo enviado");
        registrar(false);

      })
      .catch((err: string) => {
        console.log(err);
        console.log("Error al enviar email: " + email + "<->" + username + "= [" + err + "]");
        registrar(true);
      });
  }


  

  if (test.length < (numeroPreguntas + 1)) {

    for (let j = 0; j <= numeroPreguntas; j++) {

   
      
      test.push({ pregunta: "", respuesta: "" });
      logico.push({ pregunta: "", respuesta: "" });
      matematico.push({ pregunta: "", respuesta: "" });
      lengua.push({ pregunta: "", respuesta: "" });

    }


  }




  const registrar = (esError: any) => {

    i++;

    if (i >= filas.length) {


      alert("***Importación finalizada***")

      console.log("***ERRORES INICIAL***")
      console.log(erroresImportacion);
      console.log("***ERRORES FINAL***")
      return;
    }


    if(i>1 && esError)
    {

     
      var error = filas[i-1].split(',');
      
      erroresImportacion+=error+'\r\n';
    //  alert(erroresImportacion);
    
     // erroresImportacion.push({ email: error[1], username: error[0]});
  

    }


    console.log(filas[i]);

    var aspirante = filas[i].split(',');



    var username = aspirante[0];
    var email = aspirante[1];
    var password = aspirante[2];
    var carrera = aspirante[3];
    var etapa = aspirante[4];





    //      setTimeout(() => {  }, 30000);




    if (username !== '' && password !== '' && email !== '' && carrera != '' && etapa != '' && email.includes('@')) {
      /*
      alert(username);
      alert(password);
      alert(email);
      alert(carrera);
      alert(etapa);
*/

      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(res => {

          const user = res.user
          if (user) {
            // use user safely here

            var id = user.uid;
            console.log("id="+id);

            var data = {

              user: id,
              activeExam1: true,
              activeLogic: true,
              activeMat: true,
              activeLengua: true,
              time: 10800,
              timeLogic: 7300,
              timeMat: 7300,
              timeLeng: 7300,
              username: username,
              alumnData: { carrera: carrera, email: email },
              test: test,
              logico: logico,
              matematico: matematico,
              lengua: lengua,
            };

        
            db.collection(etapa)
              .doc(id)
              .set(data)
              .then((res2) => {
                console.log("todo bien");
                sendVerificationEmail(firebase, email, username);

              }


              )




              .catch((err2) => {
                console.log("error en: " + id + "y" + data);
                console.log(err2);
                registrar(true);
              });



          }




        })
        .catch((err) => {
         // alert(err);

          console.log(err);
          registrar(true);
        });
    }
    else {
      console.log("registro no importado" + email + "<->" + username);
      registrar(true);
    }

  }


  const procesaCarga = () => {

    var csv = Papa.unparse(textoCvs
      ,
      {
        quotes: false, //or array of booleans
        quoteChar: '"',
        escapeChar: '"',
        delimiter: ",",
        header: true,
        newline: "\r\n",
        skipEmptyLines: false //other option is 'greedy', meaning skip delimiters, quotes, and whitespace.
        // columns:  //or array of strings
      }

    );

    filas = csv.split('\r\n');

    i = -1;
    erroresImportacion='';

    registrar(false);


  }


  const { CSVReader } = useCSVReader();

  return (
    <CSVReader
      onUploadAccepted={(results: any) => {
        console.log('---------------------------');
        console.log(results);
        textoCvs = results;
        console.log('---------------------------');
      }}
    >
      {({
        getRootProps,
        acceptedFile,
        ProgressBar,
        getRemoveFileProps,
      }: any) => (
        <>
          <div style={styles.csvReader}>
            <button type='button' {...getRootProps()} style={styles.browseFile}>
              Browse file
            </button>
            <div style={styles.acceptedFile}>
              {acceptedFile && acceptedFile.name}
            </div>
            <button {...getRemoveFileProps()} style={styles.remove}>
              Remove
            </button>

            <button onClick={procesaCarga}>
              Procesar
            </button>

          </div>
          <ProgressBar style={styles.progressBarBackgroundColor} />
        </>
      )}
    </CSVReader>
  );
}