const express 	= require('express');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const fs = require('fs').promises;
const app = express();
current_btc = 0;

app.get('/', (req, res) => {
	res.status(200).send('<h1><b>Bem vindo ao bot</b></h1>');
	crawler();
});



const crawler = async () =>{

	const browser = await puppeteer.launch({
			headless: true,
			args: [
				 "--disable-web-security",
				 "--disable-features=IsolateOrigins,site-per-process",
				 "--no-sandbox"
			]
		});
		

		await main(browser);
}





const main = async (browser) =>{



    //Acessa o site alvo e busca pelo iframe que contem o src=https://www.google.com/recaptcha/
	const freebitco = await browser.newPage();
	const cookiesString = await fs.readFile('./cookies.json');
	const cookies = JSON.parse(cookiesString);
	await freebitco.setCookie(...cookies);
	await freebitco.goto('https://freebitco.in/?op=home');
	
	try{

		await asyncInterval(start, 10000, freebitco);
	}catch(e){
		 console.log('error handling: '+e);
	}
	

}

const asyncInterval = async (callback, ms, args, triesLeft = 5) => {
  return new Promise((resolve, reject) => {
    const interval = setInterval(async () => {
      if (await callback(args)) {
        resolve();
        clearInterval(interval);
      } 
      triesLeft--;
    }, ms);
  });
}

const balance = async (browser) => {
	await browser.waitForSelector('#balance_small');
	const contador = await browser.$eval('#balance_small', el => el.innerText);
	current_btc = contador;
}




const start = async (browser) => {
	let date_ob = new Date();
	let current_time = date_ob.getMinutes();
	await balance(browser);
	await browser.waitForSelector('#free_play_form_button')
	.then(async () => {
			const display = await browser.evaluate(() => {
		 		const display = document.querySelector('#free_play_form_button').style.display
		 		return display
		 	});
		if (display != 'none') 
			roll_click(browser);

	})
	.catch((error) => console.log("#free_play_form_button not found..."));


}


const roll_click = async (browser) => {
	try{
		free_play_form_button = await browser.$('#free_play_form_button');
		play_without_captcha  = await browser.$('#play_without_captchas_button');
					
		await play_without_captcha.click();
		await free_play_form_button.click();
		await balance(browser);

	}catch(e){
			 console.log("Erro: "+ e);
	}
}






app.listen(process.env.PORT || 3000);