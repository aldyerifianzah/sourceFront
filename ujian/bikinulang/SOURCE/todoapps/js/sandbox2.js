const language = 'Japanese';
let greeting = '';
switch (language) {
  case 'English':
    greeting = 'Good Morning!';
    break;
  case 'French':
    greeting = 'Bonjour!';
    break;
  case 'Japanese':
    greeting = 'Ohayou Gozaimasu!';
  default:
    greeting = 'Selamat Pagi!';
}
console.log(greeting);