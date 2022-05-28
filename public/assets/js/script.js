const $animalForm = document.querySelector('#animal-form');

const handleAnimalFormSubmit = event => {
  event.preventDefault();

  // get animal data and organize it
  const name = $animalForm.querySelector('[name="animal-name"]').value;
  const species = $animalForm.querySelector('[name="species"]').value;
  const dietRadioHTML = $animalForm.querySelectorAll('[name="diet"]');
  let diet;

  for (let i = 0; i < dietRadioHTML.length; i += 1) {
    if (dietRadioHTML[i].checked) {
      diet = dietRadioHTML[i].value;
    }
  }

  if (diet === undefined) {
    diet = '';
  }

  const selectedTraits = $animalForm.querySelector('[name="personality"').selectedOptions;
  const personalityTraits = [];
  for (let i = 0; i < selectedTraits.length; i += 1) {
    personalityTraits.push(selectedTraits[i].value);
  }
  const animalObject = { name, species, diet, personalityTraits };

};

// since request is coming from the server we don't need to specify the URL
fetch('/api/animals', {
  // we need to specify what kind of request in the method
  method: 'POST',
  // headers inform the request that this is going to be JSON data
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  },
  // add stringified JSON data, THIS IS NEEDED TO RECEIVE REQ.BODY ON THE SERVER
  body: JSON.stringify(animalObject)
})
  .then(response => {
    if(response.ok) {
      return response.json();
    }
    alert('Error: ' + response.statusText);
  })
  .then(postResponse => {
    console.log(postResponse);
    alert('Thank you for adding an animal!');
  });

$animalForm.addEventListener('submit', handleAnimalFormSubmit);
