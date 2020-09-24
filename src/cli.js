import arg from 'arg';
import inquirer from 'inquirer';
import fs from 'fs';
import readline from 'readline';
import figlet from 'figlet';
import base from 'nodejs-base64'
const service  = 'aW1wb3J0IHsgaHR0cFVybCB9IGZyb20gJy4uL3BsdWdpbnMvaHR0cCc7DQoNCmV4cG9ydCBkZWZhdWx0IHsNCiAgICB0ZXN0RW5kcG9pbnQ6ICgpID0+IHsNCiAgICAgICAgcmV0dXJuIGh0dHBVcmwuZ2V0KCd1cmwnKTsNCiAgICB9DQp9'
const styles = 'aW1wb3J0IHN0eWxlZCBmcm9tICdzdHlsZWQtY29tcG9uZW50cycNCg0KZXhwb3J0IGNvbnN0IENvbnRhaW5lciA9IHN0eWxlZC5kaXZgDQogICAgI2JvdGFvew0KICAgICAgbWFyZ2luOjEwcHggOyAgDQogICAgICBiYWNrZ3JvdW5kLWNvbG9yOndoaXRlOw0KICAgICAgY29sb3I6YmxhY2s7DQogICAgICBmb250LXdlaWdodDpib2xkOw0KICAgICAgd2lkdGg6MjAlOw0KICAgICAgDQogICAgfQ0KDQpg'
const view = 'aW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JzsNCmltcG9ydCB7IEJveCxCdXR0b24gfSBmcm9tICdAbWF0ZXJpYWwtdWkvY29yZScNCmltcG9ydCB7IENvbnRhaW5lciB9IGZyb20gJy4vc3R5bGUnOw0KDQpjbGFzcyBQYWdlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50ew0KICAgIGV4YW1wbGVNZXRob2QoKXsNCiAgICAgICAgICAgIA0KICAgICAgICAgICAgDQogICAgICB9DQoNCiAgICByZW5kZXIoKXsNCiAgICAgICAgcmV0dXJuICgNCiAgICAgICAgPD4NCiAgICAgICAgPENvbnRhaW5lcj4NCiAgICAgICAgICAgIDxCb3ggb3ZlcmZsb3c9ImF1dG8iIHdpZHRoPSIxIiBoZWlnaHQ9IjEiPg0KICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxCb3ggaWQ9InRpdGxlIj4NCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdj4NCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8QnV0dG9uIGhyZWY9IiMiIG9uQ2xpY2s9e3RoaXMuZXhhbXBsZU1ldGhvZH0gaWQ9ImJvdGFvIiBzaXplPSJsYXJnZSIgY29sb3I9InByaW1hcnkiPlRlc3RlPC9CdXR0b24+DQogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICANCiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L0JveD4NCiAgICAgICAgICAgIDwvQm94Pg0KICAgICAgICA8L0NvbnRhaW5lcj4NCg0KDQogICAgICAgIDwvPg0KICAgICAgICApOw0KICAgIH0NCn0NCg0KZXhwb3J0IGRlZmF1bHQgUGFnZTsNCg=='

function parseArgumentsIntoOptions(rawArgs) {
    const args = arg(
      {
        
        '--create':Boolean,
        '--help':Boolean,
        '-C': '--create',
        '-H':'--help',
        
      },
      {
        argv: rawArgs.slice(2),
      }
    );



    return {
        create:args['--create']||false,
        help:args['--help']||false,
    };
   }

   async function promptForMissingOptions(options) {
        // console.log(options)
        const defaultFile = 'Service';
        if(options.help){

            return options
        }
        const questions = [];
        if(options.create){
            questions.push({
                type: 'list',
                name: 'file',
                message: 'Qual tipo de arquivo você deseja criar?',
                choices: ['Service','View'],
                default: defaultFile,
              });
        }
        const answers = await inquirer.prompt(questions);

        return {
            ...options,
            file: options.file || answers.file,
          };

   }
   function createFile(options){
        // console.log(options);
        if((options.create == false && options.help == false)||options.help == true){
            ascii('PULSE CLI');
            return null;
        }
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        if(!fs.existsSync('./src/')){
            fs.mkdirSync('./src/');
        }
        
        rl.question('Digite o nome do arquivo: ', (answer) => {
            try{
                if(options.file == 'View'){
                    
                    fs.mkdirSync('./src/views');
                    fs.mkdirSync('./src/views/'+answer);
                    fs.appendFile('./src/views/'+answer+'/index.tsx',base.base64decode(view), function (err) {
                        if (err) throw err;
                        console.log('\x1b[32m',options.file+' criado com sucesso!');
                      });
                    fs.appendFile('./src/views/'+answer+'/style.js', base.base64decode(styles), function (err) {
                        if (err) throw err;
                        
                      });             
                    
                }
                if(options.file == 'Service'){
                    fs.mkdirSync('./src/services');
                    fs.appendFile('./src/services/'+answer+'.js', base.base64decode(service), function (err) {
                        if (err) throw err;
                        console.log('\x1b[32m',options.file+' criado com sucesso!');
                      });
                }
            }catch(e){
                if(options.file == 'View'){
                    try{
                        fs.mkdirSync('./src/views/'+answer);
                        fs.appendFile('./src/views/'+answer+'/index.tsx', base.base64decode(view), function (err) {
                            if (err) throw err;
                            console.log('\x1b[32m',options.file+' criado com sucesso!');
                        });
                        fs.appendFile('./src/views/'+answer+'/style.js', base.base64decode(styles), function (err) {
                            if (err) throw err;
                            
                        });
                    }catch(ee){
                        
                        console.log('\x1b[31m', 'Erro ao criar arquivo, o mesmo já se encontra existente');
                                 
                    }

                }
                if(options.file == 'Service'){
                    
                            fs.appendFile('./src/services/'+answer+'.js',  base.base64decode(service), function (err) {
                            if (err) throw err;
                            console.log('\x1b[32m',options.file+' criado com sucesso!');
                      });
                     
                }
                
            }
            rl.close();
        });
       
        
   }

   function ascii(text){
    figlet(text, function(err, data) {
        if (err) {
            console.log('Something went wrong...');
            console.dir(err);
            return;
        }
        console.log(data)
        console.log('\x1b[32m','LISTA DE COMANDOS')
        console.log('\x1b[32m','(--create ou -C) ----------------- Criar arquivos no projeto (Views, Services)');
    });
   }
   
   export async function cli(args) {
    
   
    try{
        let options = parseArgumentsIntoOptions(args);
        options = await promptForMissingOptions(options);
        createFile(options);
    }catch(e){
        if(e.code == 'ARG_UNKNOWN_OPTION'){
            console.log('Argumento não encontrado, use --help para consultar a lista de comandos')
        }
    }
   }