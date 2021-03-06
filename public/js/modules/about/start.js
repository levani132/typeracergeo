Module.module({
    name: 'about',
    scripts: [
        '/about.js'
    ],
    onInit () {
        Router.openModule(this.name);
    },
    view() {
        return `
        <style>
            h1 {
                padding-bottom: 0.3em;
                font-size: 2em;
                border-bottom: 1px solid #eaecef;
                margin-bottom: 16px;
                font-weight: 600;
                line-height: 1.25;
            }

            h2 {
                padding-bottom: 0.3em;
                font-size: 1.5em;
                border-bottom: 1px solid #eaecef;
                margin-top: 24px;
                margin-bottom: 16px;
                font-weight: 600;
                line-height: 1.25;
            }

            h3 {
                font-size: 1.25em;
                margin-top: 24px;
                margin-bottom: 16px;
                font-weight: 600;
                line-height: 1.25;
            }

            p, h1, h2, h3 {
                color: #24292e;
                font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";
            }
        </style>
        <h1>მწერალი</h1>
        <p>
        ეს პროექტი შექმნილია საგანმანათლებლო მიზნებისთვის (ჯერ-ჯერობით მაინც). ვებ პროგრამირების ლექტორის დავალებით უნდა შეგვექმნა პროექტი რომელშიც ძირითადი ლოგიკა იქნებოდა დაწერილი კლიენტის მხარეს და არჩევანში თავისუფალი ვიყავით, ამიტომ ჩვენ გადავწყვიტეთ აგვერჩია ცნობილი თამაშის typeracer.com-ის ქართული ანალოგი, რომელიც გამოვიდოდა საშუალო სიდიდის კლიენტის მხარეზე ორიენტირებული პროექტი, ანუ ყველაზე კარგად შეესაბამებოდა მოცემულობებს.
        </p>
        <h2>გაშვება</h2>
        <p>
        პროექტის სერვერული მხარე წარმოდგენილია node.js-ის და npm-ის ბიბლიოთეკების საშუალებით, რის გამოც მარტივია პროექტის დაკონფიგურირება და გაშვება, საჭიროა მხოლოდ ორი მარტივი ბრძანების გაშვება პროექტის საწყისი ფოლდერიდან: npm install && node index.js, რის შემდეგაც შესაძლებელია localhost:3000-ზე შესვლა browser-დან.
        </p>
        <h3>აუცილებელი ბიბლიოთეკები</h3>
        <p>
        პროექტი იყენებს npm ბიბლიოთეკებს. მისი კლიენტის მხარე იყენებს font-awesome-ს აიკონებისთვის და მისი სერვერის მხარე იყენებს ექსპრესს, პასპორტს და მათთვის საჭირო ბიბლიოთეკებს. ასევე გამოყენებულია gulp და მისთვის საჭირო ბიბლიოთეკები პროექტის დასაბილდად.
        </p>
        <h3>დაბილდვა</h3>
        <p>
        როგორც უკვე ვახსენე პროექტის გასაშვებად npm install && node index.js საკმარისია, ვინაიდან npm install თვითონ უშვებს gulp-ს ბიბლიოთეკების დაყენების შემდეგ. ცალკე დასაბილდად შესაძლებელია gulp ბრძანების გაშვება production ვერსიის მისაღებად ან gulp debug ბრძანების გაშვება დეველოპერული ვერსიის დასააბილდად.
        </p>
        <h2>პროექტის სტრუქტურა.</h2>
        <p>
        პროექტის სერვერული მხარე საკმაოდ მარტივად არის შექმნილი, ყველა მოთხოვნას იღებს index.js და ყველა მოთხოვნაზე თუ post მეთოდით არ ხდება ან ასეთი ფაილი არ არსებობს სერვერზე, აგზავნის index.html-ს რათა ყველანაირი როუტინგი და ლოგიკა კლიენტის მხარეს დამუშავდეს. რაც შეეხება კლიენტის მხარეს, კლიენტის მხარის სტრუქტურაზე სანამ წერას დავიწყებდით ბევრად უფრო ადრე ვფიქრობდით და გავლენა მოახდინა ისეთმა ბიბლიოთეკებმა როგორიცაა react.js, angular, vue.js ვინაიდან საინტერესო იყო ისეთი თვისებები როგორიცაა front-end routing ან lazy-loading. ამის მისაღწევად დავწერეთ პატარა framework-ვით რომელიც შედგება router, modules და view სოურს ფაილებისგან და მოცემული სტრუქტურის მიხედვით base ფოლდერში უნდა ჩაიყაროს ყველა ის js სოურს კოდი რომელიც გვინდა რომ საიტს ყოველთვის თან ქონდეს, ხოლო modules ფოლდერში უნდა ჩაიყაროს მოდულები, რომლებიც ფოლდერებად იყოფა. თითოეულ მოდულს აქვს თავისი საწყისი ფაილი, რომელშიც შეგვიძლია მივუთითოთ ფაილები რაც ამ მოდულს ჭირდება, ჩატვირთვის ლოგიკა და ფაილებიდან view-ები რა ლოგიკით დაბრუნდეს ამ მოდულისთვის. თითოეული მოდულის ფაილი შეგვიძლია შევქმნათ წინასწარ განსაზღვრული მოდელის მიხედვით, რაც საშუალებას მოგვცემს როუტერს ვუთხრათ რომ ამ კომპონენტის view-ს გახსნის და დახურვისას გამოიძახოს onLoad და onExit მეთოდები შესაბამისად. პროექტი ასევე იყენებს სერვის ობიექტს, რომელიც მის თავში აერთიანებს post/get მეთოდების მარტივად გამოძახების საშუალებას.
        </p>
        <h3>ვიუები</h3>
        <p>
        როგორც index.html-ში ჩანს შიგნით თიქმის არაფერი არ წერია გარდა app თაგისა. ამ თაგში view ფაილი არენდერებს layout-ს საიდანაც იწყება მთელი საიტი და შემდეგ როუტერის საშუალებით ხდება დადგენა რომელი მოდული ჩაიტვირთოს და რომელი კომპონენტი დარენდერდეს.
        </p>
        <p>
        როგორც კი site.js იტვირთება ის იძახებს მთავარ view ფუნქციას, რომელიც როუტერის დახმარებით იძახებს საჭირო კომპონენტების view მეთოდებს. აქედან დაწყებული პროექტი იყენებს ჯავასკრიპტის შაბლონებს ცვლადების მარტივად შემოსატანად და დომის დინამიურად გასაახლებლად.
        </p>
        <p>
        ამ ტიპის სტრუქტურა სუფთა კოდის წერის საშუალებას გვაძლევს, რადგან ყოველ ჯერზე როცა რაიმე კომპონენტის ობიექტი იცვლება, გამოიძახება ამ კომპონენტის view მეთოდი, რომელიც აგენერირებს html სტრინგს რომელიც გამზადებულია დომ-ში ჩასასმელად.
        </p>
        <h3>ბაზები</h3>
        <p>
        პროექტი იყენებს mongodb და mongoose-ს ინფორმაციის შესანახად.
        </p>
        <h3>სერვისები</h3>
        <p>
        სერვისების გამოძახება ხდება მარტივად, ერთი ფაილიდან, რომელიც საშუალებას მაძლევს get/post მოთხოვნები მარტივად გავაგზავნო, ასევე სუფთა კოდის შესანარჩუნებლად ამ ფაილშივე ხდება მოთხოვნების გამოძახება ხოლო ფაილი ისე ფუთავს ამ მოთხოვნებს, რომ სხვა ადგილიდან უბრალოდ მეთოდის სახით გამოიძახებოდეს სერვისები. პასუხის დასაბრუნებლად კი გამოყენებულია js Promise-ები.
        </p>
        `;
    }
});