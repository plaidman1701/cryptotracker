// gets the crypto data, formats it for output and then outputs
function getCryptoData(selectedCryptos, currencyBasis) {

	$.get("https://min-api.cryptocompare.com/data/pricemultifull", { fsyms:selectedCryptos.toString(), tsyms:currencyBasis }, function(data)
	{
		var outputString = '<div id="crytpoBoxList"><p id="listHeader">Values refresh every 10 seconds</p>';

		for (var i = 0; i < selectedCryptos.length; i++)
		{
			// for skeleton, 2 cells per row
			if (i % 2 == 0)
			{
				outputString = outputString.concat('<div class="row">'); 
			}

			outputString = outputString.concat('<div id="' + selectedCryptos[i] + 'div" class="six columns cryptoBlock">');
			outputString = outputString.concat('<p class="cryptoBlockName">' + selectedCryptos[i] + '</p>');
			outputString = outputString.concat('<p class="cryptoBlockPrice">' + currencyBasis + ' $'+ parseFloat(data['RAW'][selectedCryptos[i]][currencyBasis]['PRICE']).toFixed(2) + '</p>');
			outputString = outputString.concat('<p class="cryptoBlockDeets">last 24 hours:<br />');
			outputString = outputString.concat('Open: ' + currencyBasis + ' $'+ parseFloat(data['RAW'][selectedCryptos[i]][currencyBasis]['OPEN24HOUR']).toFixed(2) + '<br />');
			outputString = outputString.concat('Gain: '+ parseFloat(data['RAW'][selectedCryptos[i]][currencyBasis]['CHANGEPCT24HOUR']).toFixed(2) + ' %<br />');
			outputString = outputString.concat('High: ' + currencyBasis + ' $'+ parseFloat(data['RAW'][selectedCryptos[i]][currencyBasis]['HIGH24HOUR']).toFixed(2) + '<br />');
			outputString = outputString.concat('Low: ' + currencyBasis + ' $'+ parseFloat(data['RAW'][selectedCryptos[i]][currencyBasis]['LOW24HOUR']).toFixed(2) + '<br />');
			
			var tempDate = new Date(data['RAW'][selectedCryptos[i]][currencyBasis]['LASTUPDATE'] * 1000);
			var dateOptions = {  
				weekday: "short", year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" , second: "2-digit" 
			};

			outputString = outputString.concat('Last Updated:<br />'+ tempDate.toLocaleTimeString("en-us", dateOptions) + '</p>');
			outputString = outputString.concat('</div><!-- .six columns -->');

			// for skeleton, 2 cells per row
			if (i % 2 == 1)
			{
				outputString = outputString.concat('</div><!-- .row -->'); 
			}
		}

		outputString = outputString.concat('</div>'); // crytpoBoxList

		// send output to page
		$('#outputDiv').html(outputString);
	}); // get
}

// prepping for get call
function callExternal() {
	$('#outputDiv').html('fetching data...');

	// stop loading previous list
	if (cryptoInterval != null)
	{
		clearInterval(cryptoInterval);
	}

	// get array of selected cryptos
	var selectedCryptos = [];

	$('.cryptoCheckboxes input:checked').each(function() {
		var tempvar = $(this).val();
		selectedCryptos.push($(this).val());
	});

	// if nothing selected, clear out display
	if (selectedCryptos.length == 0)
	{
		$('#outputDiv').empty();
		return;
	}

	// get currency to show values in
	var currencyBasis = $('.currencies input:checked').val();

	// first call
	getCryptoData(selectedCryptos, currencyBasis);

	// subsequent calls every 10 seconds
	cryptoInterval = setInterval(function() {
		getCryptoData(selectedCryptos, currencyBasis);
	}, 10000);
}

function resetCheckboxes() {
	$('input.checkboxInput').prop("checked", false);

	$('input#checkboxBTC').prop("checked", true);
	$('input#radioCAD').prop("checked", true);
}

var cryptoInterval = null;
var btnSubmit = document.getElementById('btnSubmitList');
var btnReset = document.getElementById('btnResetList');

btnSubmit.onclick = callExternal;
btnReset.onclick = resetCheckboxes;