import arg from 'arg';
import inquirer from 'inquirer';
import fs from 'fs';
import readline from 'readline';
function parseArgumentsIntoOptions(rawArgs) {
    const args = arg(
      {
        
        '--create':Boolean,
        '--help':Boolean,
        '-C': '--create',
        '-H':'--help'
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
            console.log('ARCHETYPE PULSE');
            console.log('--create, -C => Criar arquivos no projeto (Views, Services)');
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
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        
        rl.question('Digite o nome do arquivo: ', (answer) => {
            try{
                if(options.file == 'View'){
                    fs.mkdirSync('views');
                    fs.mkdirSync('views/'+answer);
                    fs.appendFile('./views/'+answer+'/index.tsx', '', function (err) {
                        if (err) throw err;
                        console.log(options.file+' criado com sucesso!');
                      });
                    fs.appendFile('./views/'+answer+'/style.js', '', function (err) {
                        if (err) throw err;
                        
                      });             
                    
                }
                if(options.file == 'Service'){
                    fs.mkdirSync('services');
                    fs.appendFile('./services/'+answer+'.js', '', function (err) {
                        if (err) throw err;
                        console.log(options.file+' criado com sucesso!');
                      });
                }
            }catch(e){
                if(options.file == 'View'){
                    try{
                        fs.mkdirSync('views/'+answer);
                        fs.appendFile('./views/'+answer+'/index.tsx', '', function (err) {
                            if (err) throw err;
                            console.log(options.file+' criado com sucesso!');
                        });
                        fs.appendFile('./views/'+answer+'/style.js', '', function (err) {
                            if (err) throw err;
                            
                        });
                    }catch(ee){
                        console.log('Erro ao criar arquivo, o mesmo já se encontra existente')                        
                    }

                }
                if(options.file == 'Service'){
                    
                            fs.appendFile('./services/'+answer+'.js', '', function (err) {
                            if (err) throw err;
                            console.log(options.file+' criado com sucesso!');
                      });
                     
                }
                
            }
            rl.close();
        });
       
        
   }
   
   export async function cli(args) {
    let options = parseArgumentsIntoOptions(args);
    options = await promptForMissingOptions(options);
    createFile(options);
    
   }