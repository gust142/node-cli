import arg from 'arg';
import inquirer from 'inquirer';
import fs from 'fs';
import readline from 'readline';
import figlet from 'figlet';
import base from 'nodejs-base64';
import childProcess from  'child_process';

const service  = 'aW1wb3J0IHsgaHR0cFVybCB9IGZyb20gJy4uL3BsdWdpbnMvaHR0cCc7DQoNCmV4cG9ydCBkZWZhdWx0IHsNCiAgICB0ZXN0RW5kcG9pbnQ6ICgpID0+IHsNCiAgICAgICAgcmV0dXJuIGh0dHBVcmwuZ2V0KCd1cmwnKTsNCiAgICB9DQp9'
const styles = 'aW1wb3J0IHN0eWxlZCBmcm9tICdzdHlsZWQtY29tcG9uZW50cycNCg0KZXhwb3J0IGNvbnN0IENvbnRhaW5lciA9IHN0eWxlZC5kaXZgDQogICAgI2JvdGFvew0KICAgICAgbWFyZ2luOjEwcHggOyAgDQogICAgICBiYWNrZ3JvdW5kLWNvbG9yOndoaXRlOw0KICAgICAgY29sb3I6YmxhY2s7DQogICAgICBmb250LXdlaWdodDpib2xkOw0KICAgICAgd2lkdGg6MjAlOw0KICAgICAgDQogICAgfQ0KDQpg'
const reactView = 'aW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JzsNCmltcG9ydCB7IEJveCxCdXR0b24gfSBmcm9tICdAbWF0ZXJpYWwtdWkvY29yZScNCmltcG9ydCB7IENvbnRhaW5lciB9IGZyb20gJy4vc3R5bGUnOw0KDQpjbGFzcyBQYWdlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50ew0KICAgIGV4YW1wbGVNZXRob2QoKXsNCiAgICAgICAgICAgIA0KICAgICAgICAgICAgDQogICAgICB9DQoNCiAgICByZW5kZXIoKXsNCiAgICAgICAgcmV0dXJuICgNCiAgICAgICAgPD4NCiAgICAgICAgPENvbnRhaW5lcj4NCiAgICAgICAgICAgIDxCb3ggb3ZlcmZsb3c9ImF1dG8iIHdpZHRoPSIxIiBoZWlnaHQ9IjEiPg0KICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxCb3ggaWQ9InRpdGxlIj4NCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdj4NCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8QnV0dG9uIGhyZWY9IiMiIG9uQ2xpY2s9e3RoaXMuZXhhbXBsZU1ldGhvZH0gaWQ9ImJvdGFvIiBzaXplPSJsYXJnZSIgY29sb3I9InByaW1hcnkiPlRlc3RlPC9CdXR0b24+DQogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICANCiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L0JveD4NCiAgICAgICAgICAgIDwvQm94Pg0KICAgICAgICA8L0NvbnRhaW5lcj4NCg0KDQogICAgICAgIDwvPg0KICAgICAgICApOw0KICAgIH0NCn0NCg0KZXhwb3J0IGRlZmF1bHQgUGFnZTsNCg=='
const vueView = 'PHRlbXBsYXRlPg0KICA8ZGl2IGNsYXNzPSJob21lIj4NCiAgICA8aDE+SGVsbG8gV29ybGQ8L2gxPg0KICA8L2Rpdj4NCjwvdGVtcGxhdGU+DQo8c2NyaXB0Pg0KICBleHBvcnQgZGVmYXVsdCB7DQogICAgbmFtZTogJ0V4YW1wbGUnLA0KICAgIGNvbXBvbmVudHM6IHsNCg0KICAgIH0sDQogIH0NCjwvc2NyaXB0Pg0K';
const reactRepository = 'git clone https://github.com/gust142/modelo-projeto-reactjs.git';
const vueRepository  = '';
const angularRepository = '';
const vueFile = '/index.vue';
const reactFile = '/index.tsx';

function parseArgumentsIntoOptions(rawArgs) {
    const args = arg(
      {
        
        '--create':Boolean,
        '--start':Boolean,
        '--help':Boolean,
        '-S':'--start',
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
        start:args['--start']||false
    };
   }

   async function promptForMissingOptions(options) {
        // console.log(options)
        const defaultFile = 'Service';
        if(options.help){

            return options
        }
        if(options.start){
            return createArchetype(options);
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
   async function manageCommands(options){
        // console.log(options);
        if((!options.create && !options.help && !options.start)||options.help){
            ascii('PULSE CLI');
            return null;
        }
        if(options.start){
            
            cloneRepository(options);
            return null
        }
        if(options.create){
            const questions = [];
            const defaultFile = 'VueJS';
            questions.push({
                type: 'list',
                name: 'platform',
                message: 'Deseja criar o arquivo em qual tecnologia?',
                choices: ['VueJS','React','Angular'],
                default: defaultFile,
              });
        
            const answers = await inquirer.prompt(questions);
            createFile(options,answers.platform);
        }
       
        
   }
   async function createFile(options,platform){
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        if(!fs.existsSync('./src/')){
            fs.mkdirSync('./src/');
        }
        
        rl.question('Digite o nome do arquivo: ', (answer) => {
                if(options.file == 'View'){
                     
                    !fs.existsSync('./src/views')?fs.mkdirSync('./src/views'):'';
                try{
                            var content = '';
                            fs.mkdirSync('./src/views/'+answer);
                            if(platform == 'React'){
                                content = base.base64decode(reactView).replace('Page',answer).replace('Page;',answer+';');

                                fs.appendFile('./src/views/'+answer+reactFile,content, function (err) {
                                    if (err) throw err;
                                    console.log('\x1b[32m',options.file+' criado com sucesso!');
                                });
                                fs.appendFile('./src/views/'+answer+'/style.js', base.base64decode(styles), function (err) {
                                    if (err) throw err;
                                    
                                });
                            }else if(platform == 'VueJS'){
                                content = base.base64decode(vueView).replace('Example',answer);
                                fs.appendFile('./src/views/'+answer+'/'+answer+'.vue',content, function (err) {
                                    if (err) throw err;
                                    console.log('\x1b[32m',options.file+' criado com sucesso!');
                                });
                            }    
                }catch(e){
                        console.log('\x1b[31m', 'Erro ao criar arquivo, o mesmo já se encontra existente');
                                
                        }        
                }
                if(options.file == 'Service'){
                    !fs.existsSync('./src/services')?fs.mkdirSync('./src/services'):'';
                    fs.appendFile('./src/services/'+answer+'.js', base.base64decode(service), function (err) {
                        if (err) throw err;
                        console.log('\x1b[32m',options.file+' criado com sucesso!');
                    });
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
        console.log('\x1b[32m','LISTA DE COMANDOS');
        console.log('\x1b[32m','(--start ou -S) ----------------- Gerar Modelo de projeto (Vue, React, Angular)');
        console.log('\x1b[32m','(--create ou -C) ----------------- Criar arquivos no projeto (Views, Services)');
    });
   }


   async function createArchetype(options){
        const defaultFile = 'VueJS';
        
        const questions = [];
        if(options.start){
            questions.push({
                type: 'list',
                name: 'type',
                message: 'Qual tipo de projeto deseja criar?',
                choices: ['VueJS','React','Angular'],
                default: defaultFile,
            });
        }
        const answers = await inquirer.prompt(questions);

        return {
            ...options,
            type: options.type || answers.type,
        };

   }

   async function cloneRepository(options){
    var url  = '';
    if(options.type == 'React'){
        url = reactRepository;
    }else if(options.type == 'VueJS'){
        url = vueRepository;
    }else if(options.type == 'Angular'){
        url = angularRepository;
    }
    childProcess.exec(url, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return
        }
        if (stderr) {
            console.log('\x1b[32m',`${stderr}`);
            console.log('\x1b[32m','Modelo de Projeto criado!');
        }
        if(stdout){
            console.log(stdout)
        }
        
    });

   }

   
   export async function cli(args) {
    try{
        let options = parseArgumentsIntoOptions(args);
        options = await promptForMissingOptions(options);
        await manageCommands(options);
    }catch(e){
        if(e.code == 'ARG_UNKNOWN_OPTION'){
            console.log('Argumento não encontrado, use --help para consultar a lista de comandos')
        }
    }
   }