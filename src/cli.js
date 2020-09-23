import arg from 'arg';
import inquirer from 'inquirer';
import fs from 'fs';
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
       
        try{
            if(options.file == 'View'){
                fs.mkdirSync('views');
    
            }
            if(options.file == 'Service'){
                fs.mkdirSync('services');
            }
        }catch(e){
            
            
        }
   }
   
   export async function cli(args) {
    let options = parseArgumentsIntoOptions(args);
    options = await promptForMissingOptions(options);
    createFile(options);
    
   }