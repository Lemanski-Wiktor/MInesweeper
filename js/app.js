class Saper{
    constructor(){
        this.width = 0;
        this.height = 0;
        this.mines = 0;
    }

    area(){
        const user_width = document.getElementById("iwidth");
        const user_height = document.getElementById("iheight");
        const user_mines = document.getElementById("imines");

        this.width = user_width.values;
        this.height = user_height.values;
        this.mines = user_mines;

        let tab = [];
        let output_area = ""

        for(let i=0; i<this.width; i++){
            for(let j=0; j<this.height; i++){
                tab[i][j] = i + ", " + j;
                output_area += tab[i][j] + " || ";
            }
            output_area += "<br>";
        }
        document.getElementById("saper_area").innerHTML = output_area;
    }
}

let Saper1 = new Saper();
Saper1.area();