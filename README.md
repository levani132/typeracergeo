# მწერალი

ეს პროექტი შექმნილია საგანმანათლებლო მიზნებისთვის (ჯერ-ჯერობით მაინც). ვებ პროგრამირების ლექტორის დავალებით უნდა შეგვექმნა პროექტი რომელშიც ძირითადი ლოგიკა იქნებოდა დაწერილი კლიენტის მხარეს და არჩევანში თავისუფალი ვიყავით, ამიტომ ჩვენ გადავწყვიტეთ აგვერჩია ცნობილი თამაშის typeracer.com-ის ქართული ანალოგი, რომელიც გამოვიდოდა საშუალო სიდიდის კლიენტის მხარეზე ორიენტირებული პროექტი, ანუ ყველაზე კარგად შეესაბამებოდა მოცემულობებს.

## გაშვება

პროექტის სერვერული მხარე წარმოდგენილია node.js-ის და npm-ის ბიბლიოთეკების საშუალებით, რის გამოც მარტივია პროექტის დაკონფიგურირება და გაშვება, საჭიროა მხოლოდ ორი მარტივი ბრძანების გაშვება პროექტის საწყისი ფოლდერიდან: npm install && node index.js, რის შემდეგაც შესაძლებელია localhost:3000-ზე შესვლა browser-დან.

### აუცილებელი ბიბლიოთეკები

პროექტი იყენებს npm ბიბლიოთეკებს. მისი კლიენტის მხარე იყენებს font-awesome-ს აიკონებისთვის და მისი სერვერის მხარე იყენებს ექსპრესს, პასპორტს და მათთვის საჭირო ბიბლიოთეკებს. ასევე გამოყენებულია gulp და მისთვის საჭირო ბიბლიოთეკები პროექტის დასაბილდად.

### დაბილდვა

როგორც უკვე ვახსენე პროექტის გასაშვებად npm install && node index.js საკმარისია, ვინაიდან npm install თვითონ უშვებს gulp-ს ბიბლიოთეკების დაყენების შემდეგ. ცალკე დასაბილდად შესაძლებელია gulp ბრძანების გაშვება production ვერსიის მისაღებად ან gulp debug ბრძანების გაშვება დეველოპერული ვერსიის დასააბილდად.

## პროექტის სტრუქტურა.

პროექტის სერვერული მხარე საკმაოდ მარტივად არის შექმნილი, ყველა მოთხოვნას იღებს index.js და ყველა მოთხოვნაზე თუ post მეთოდით არ ხდება ან ასეთი ფაილი არ არსებობს სერვერზე, აგზავნის index.html-ს რათა ყველანაირი როუტინგი და ლოგიკა კლიენტის მხარეს დამუშავდეს. რაც შეეხება კლიენტის მხარეს, კლიენტის მხარის სტრუქტურაზე სანამ წერას დავიწყებდით ბევრად უფრო ადრე ვფიქრობდით და გავლენა მოახდინა ისეთმა ბიბლიოთეკებმა როგორიცაა react.js, angular, vue.js ვინაიდან საინტერესო იყო ისეთი თვისებები როგორიცაა front-end routing ან lazy-loading. ამის მისაღწევად დავწერეთ პატარა framework-ვით რომელიც შედგება router, modules და view სოურს ფაილებისგან და მოცემული სტრუქტურის მიხედვით base ფოლდერში უნდა ჩაიყაროს ყველა ის js სოურს კოდი რომელიც გვინდა რომ საიტს ყოველთვის თან ქონდეს, ხოლო modules ფოლდერში უნდა ჩაიყაროს მოდულები, რომლებიც ფოლდერებად იყოფა. თითოეულ მოდულს აქვს თავისი საწყისი ფაილი, რომელშიც შეგვიძლია მივუთითოთ ფაილები რაც ამ მოდულს ჭირდება, ჩატვირთვის ლოგიკა და ფაილებიდან view-ები რა ლოგიკით დაბრუნდეს ამ მოდულისთვის. თითოეული მოდულის ფაილი შეგვიძლია შევქმნათ წინასწარ განსაზღვრული მოდელის მიხედვით, რაც საშუალებას მოგვცემს როუტერს ვუთხრათ რომ ამ კომპონენტის view-ს გახსნის და დახურვისას გამოიძახოს onLoad და onExit მეთოდები შესაბამისად. პროექტი ასევე იყენებს სერვის ობიექტს, რომელიც მის თავში აერთიანებს post/get მეთოდების მარტივად გამოძახების საშუალებას.

### ვიუები

როგორც index.html-ში ჩანს შიგნით თიქმის არაფერი არ წერია გარდა app თაგისა. ამ თაგში view ფაილი არენდერებს layout-ს საიდანაც იწყება მთელი საიტი და შემდეგ როუტერის საშუალებით ხდება დადგენა რომელი მოდული ჩაიტვირთოს და რომელი კომპონენტი დარენდერდეს.

როგორც კი site.js იტვირთება ის იძახებს მთავარ view ფუნქციას, რომელიც როუტერის დახმარებით იძახებს საჭირო კომპონენტების view მეთოდებს. აქედან დაწყებული პროექტი იყენებს ჯავასკრიპტის შაბლონებს ცვლადების მარტივად შემოსატანად და დომის დინამიურად გასაახლებლად.

ამ ტიპის სტრუქტურა სუფთა კოდის წერის საშუალებას გვაძლევს, რადგან ყოველ ჯერზე როცა რაიმე კომპონენტის ობიექტი იცვლება, გამოიძახება ამ კომპონენტის view მეთოდი, რომელიც აგენერირებს html სტრინგს რომელიც გამზადებულია დომ-ში ჩასასმელად.

### ბაზები

პროექტი იყენებს mongodb და mongoose-ს ინფორმაციის შესანახად.

### სერვისები

სერვისების გამოძახება ხდება მარტივად, ერთი ფაილიდან, რომელიც საშუალებას მაძლევს get/post მოთხოვნები მარტივად გავაგზავნო, ასევე სუფთა კოდის შესანარჩუნებლად ამ ფაილშივე ხდება მოთხოვნების გამოძახება ხოლო ფაილი ისე ფუთავს ამ მოთხოვნებს, რომ სხვა ადგილიდან უბრალოდ მეთოდის სახით გამოიძახებოდეს სერვისები. პასუხის დასაბრუნებლად კი გამოყენებულია js Promise-ები.