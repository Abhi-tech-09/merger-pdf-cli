#! /usr/bin/env node
// https://blog.logrocket.com/creating-a-cli-tool-with-node-js/
// https://icanhazdadjoke.com/
// https://www.sitepoint.com/javascript-command-line-interface-cli-node-js/
/*
Some usefull and fun packages for CLI 
chalk — colorizes the output
clear — clears the terminal screen
clui — draws command-line tables, gauges and spinners
figlet — creates ASCII art from text
inquirer — creates interactive command-line user interface
minimist — parses argument options
configstore — easily loads and saves config without you having to think about where and how.

 */
const program = require("commander");
const chalk = require("chalk");
const axios = require('axios')
const FormData = require('form-data')
const fs = require('fs')

program
    .argument('<pdf1>', 'First pdf')
    .argument('<pdf2>', 'Second pdf')
    .description("Merge PDF")
    .action(show)
    .parse(process.argv);



function show(pdf1, pdf2) {
    console.log(chalk.red(pdf1))
    console.log(chalk.red(pdf2))

    console.log(chalk.green("Merging PDF's"))


    const formData = new FormData()
    formData.append('instructions', JSON.stringify({
        parts: [
            {
                file: `${pdf1}`
            },
            {
                file: `${pdf2}`
            }
        ]
    }))
    formData.append(`${pdf1}`, fs.createReadStream(`${pdf1}.pdf`))
    formData.append(`${pdf2}`, fs.createReadStream(`${pdf2}.pdf`))

        ; (async () => {
            try {
                const response = await axios.post('https://api.pspdfkit.com/build', formData, {
                    headers: formData.getHeaders({
                        'Authorization': 'Bearer pdf_live_N3vCRxsZZjga8TE0YZQczwuuY9AONnsfYanIdizsyrL'
                    }),
                    responseType: "stream"
                })

                response.data.pipe(fs.createWriteStream("result.pdf"))
            } catch (e) {
                console.log("Dont know what happened");
                console.log(e);              // const errorString = await streamToString(e.response.data)
                // console.log(errorString)
            }
        })()

}

function streamToString(stream) {
    const chunks = []
    return new Promise((resolve, reject) => {
        stream.on("data", (chunk) => chunks.push(Buffer.from(chunk)))
        stream.on("error", (err) => reject(err))
        stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")))
    })
}



