class Foto {
    constructor(src, x, y, width, height) {
        this.kep = document.createElement("img");
        this.kep.src = src;
        this.kep.style.position = "absolute";
        this.kep.style.left = x + "px";
        this.kep.style.top = y + "px";
        this.kep.width = width;
        this.kep.height = height;
        this.kep.style.borderRadius = "10px";
        this.kep.style.boxShadow = "0px 4px 10px rgba(0,0,0,0.5)";

      
        document.body.appendChild(this.kep);
    }

    show() { this.kep.style.visibility = "visible"; }
    hide() { this.kep.style.visibility = "hidden"; }

    putAt(x, y) {
        this.kep.style.left = x + "px";
        this.kep.style.top = y + "px";
    }

    resize(width, height) {
        this.kep.width = width;
        this.kep.height = height;
    }
}


class CimkezettFoto extends Foto {
    constructor(src, x, y, width, height, subtitle) {
        
        super(src, x, y, width, height);

        this.subtitle = document.createElement("div");
        this.subtitle.innerHTML = subtitle;
        this.subtitle.style.position = "absolute";
        this.subtitle.style.left = x + "px";
        this.subtitle.style.top = (parseInt(y) + parseInt(height) + 10) + "px";
        this.subtitle.style.width = width + "px";
        this.subtitle.style.textAlign = "center";
        this.subtitle.style.padding = "5px 15px";
        this.subtitle.style.borderRadius = "5px";
        this.subtitle.style.fontWeight = "bold";

        
        document.body.appendChild(this.subtitle);
    }

    show() {
        super.show();
        this.subtitle.style.visibility = "visible";
    }

    hide() {
        super.hide();
        this.subtitle.style.visibility = "hidden";
    }

    putAt(x, y) {
        super.putAt(x, y);
        this.subtitle.style.left = x + "px";
        this.subtitle.style.top = (parseInt(y) + parseInt(this.kep.height) + 10) + "px";
    }

    resize(width, height) {
        super.resize(width, height);
        this.subtitle.style.top = (parseInt(this.kep.style.top) + parseInt(height) + 10) + "px";
    }
}