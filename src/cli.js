import arg from 'arg';
import inquirer from 'inquirer';
import fs from 'fs';
import readline from 'readline';
import figlet from 'figlet';

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
        
        rl.question('Digite o nome do arquivo: ', (answer) => {
            try{
                if(options.file == 'View'){
                    fs.mkdirSync('./src/views');
                    fs.mkdirSync('./src/views/'+answer);
                    fs.appendFile('./src/views/'+answer+'/index.tsx', fs.readFileSync('./src/templates/view.txt').toString(), function (err) {
                        if (err) throw err;
                        console.log(options.file+' criado com sucesso!');
                      });
                    fs.appendFile('./src/views/'+answer+'/style.js', fs.readFileSync('./src/templates/styles.txt').toString(), function (err) {
                        if (err) throw err;
                        
                      });             
                    
                }
                if(options.file == 'Service'){
                    fs.mkdirSync('./src/services');
                    fs.appendFile('./src/services/'+answer+'.js', fs.readFileSync('./src/templates/service.txt').toString(), function (err) {
                        if (err) throw err;
                        console.log(options.file+' criado com sucesso!');
                      });
                }
            }catch(e){
                if(options.file == 'View'){
                    try{
                        fs.mkdirSync('./src/views/'+answer);
                        fs.appendFile('./src/views/'+answer+'/index.tsx', fs.readFileSync('./src/templates/view.txt').toString(), function (err) {
                            if (err) throw err;
                            console.log(options.file+' criado com sucesso!');
                        });
                        fs.appendFile('./src/views/'+answer+'/style.js', fs.readFileSync('./src/templates/styles.txt').toString(), function (err) {
                            if (err) throw err;
                            
                        });
                    }catch(ee){
                        console.log('Erro ao criar arquivo, o mesmo já se encontra existente')                        
                    }

                }
                if(options.file == 'Service'){
                    
                            fs.appendFile('./src/services/'+answer+'.js',  fs.readFileSync('./src/templates/service.txt').toString(), function (err) {
                            if (err) throw err;
                            console.log(options.file+' criado com sucesso!');
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
        console.log('LISTA DE COMANDOS')
        console.log('(--create ou -C) ----------------- Criar arquivos no projeto (Views, Services)');
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