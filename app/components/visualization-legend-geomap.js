import Ember from 'ember';

export default Ember.Component.extend({
    actions: {
        savePng() {
  
            var svgElement = $(`.leaflet-zoom-animated`).get(0)
            var d = new Date();
            var file_name = d.getDate()  + "-" + (d.getMonth()+1) + "-" + d.getFullYear() + " " + d.getHours() + "_" + d.getMinutes() + "_" + d.getSeconds()

            svgElement.setAttribute("width", svgElement.getBoundingClientRect().width);
            svgElement.setAttribute("height", svgElement.getBoundingClientRect().height);
            svgElement.style.width = null;
            svgElement.style.height= null;

            html2canvas($(`.visualizationComponent_div`).get(0), {
                allowTaint: true,
                onrendered: function(canvas) {
                    var myImage = canvas.toDataURL("image/png");
                    saveAs(myImage, `${file_name}.png`);
                }
            });

        },
        savePdf() {
   
            var svgElement = $(`.leaflet-zoom-animated`).get(0)
            var d = new Date();
            var file_name = d.getDate()  + "-" + (d.getMonth()+1) + "-" + d.getFullYear() + " " + d.getHours() + "_" + d.getMinutes() + "_" + d.getSeconds()

            svgElement.setAttribute("width", svgElement.getBoundingClientRect().width);
            svgElement.setAttribute("height", svgElement.getBoundingClientRect().height);
            svgElement.style.width = null;
            svgElement.style.height= null;

            var HTML_Width = svgElement.getBoundingClientRect().width;
            var HTML_Height = svgElement.getBoundingClientRect().height;
            var top_left_margin = 15;
            var PDF_Width = HTML_Width + (top_left_margin * 2);
            var PDF_Height = (PDF_Width * 1.5) + (top_left_margin * 2);
            var canvas_image_width = HTML_Width;
            var canvas_image_height = HTML_Height;

            var totalPDFPages = Math.ceil(HTML_Height / PDF_Height) - 1;

            html2canvas($(`.visualizationComponent_div`).get(0), {
                onrendered: function(canvas) {
                    var myImage = canvas.toDataURL("image/jpeg", 1.0);
                    var pdf = new jsPDF('p', 'pt', [PDF_Width, PDF_Height]);

                    pdf.addImage(myImage, 'JPG', top_left_margin, top_left_margin, canvas_image_width, canvas_image_height);

                    for (var i = 1; i <= totalPDFPages; i++) { 
                        pdf.addPage(PDF_Width, PDF_Height);
                        pdf.addImage(imgData, 'JPG', top_left_margin, -(PDF_Height*i)+(top_left_margin*4),canvas_image_width,canvas_image_height);
                    }

                    pdf.save(`${file_name}.pdf`);

                    saveAs(pdf, `${file_name}.pdf`);
                }
            });

        },
    }
});
