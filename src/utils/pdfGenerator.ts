import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { createRoot } from "react-dom/client";
import React from "react";
import InvoiceTemplate from "../components/InvoiceTemplate";

export const generatePDF = async (invoiceData, templateNumber) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Create a temporary container
      const tempContainer = document.createElement("div");
      tempContainer.style.position = "absolute";
      tempContainer.style.left = "-9999px";
      tempContainer.style.top = "-9999px";
      tempContainer.style.width = "210mm";
      tempContainer.style.minHeight = "297mm";
      tempContainer.style.backgroundColor = "white";
      tempContainer.style.overflow = "visible";
      tempContainer.style.pageBreakInside = "avoid";
      tempContainer.style.padding = "5mm"; // Reduced padding from 10mm to 5mm
      document.body.appendChild(tempContainer);

      // Create root and render the component
      const root = createRoot(tempContainer);

      await new Promise((renderResolve) => {
        root.render(
          React.createElement(InvoiceTemplate, {
            data: invoiceData,
            templateNumber: templateNumber,
          })
        );

        // Wait for images to load and content to render
        setTimeout(() => {
          renderResolve();
        }, 2000);
      });

      // A4 dimensions in mm with reduced margins
      const a4Width = 210;
      const a4Height = 297;
      const pageMargin = 8; // Reduced margin from 15 to 8

      // Convert to pixels (3.78 pixels per mm at 96 DPI)
      const pixelsPerMm = 3.78;
      const pageHeightPx = (a4Height - pageMargin * 2) * pixelsPerMm;
      const marginPx = pageMargin * pixelsPerMm;

      // Get content sections that shouldn't be split
      const sections = tempContainer.querySelectorAll("[data-pdf-section]");
      const sectionData = Array.from(sections).map((section) => ({
        element: section,
        top: section.offsetTop,
        height: section.offsetHeight,
        type: section.getAttribute("data-pdf-section"),
      }));

      // Calculate page breaks with improved handling for footer sections
      let pages = [];
      let currentPageContent = [];
      let currentPageHeight = 0;

      // Footer sections that should be kept together on the last page
      const footerSections = ["bank-details", "terms", "signature"];
      let footerStartIndex = -1;

      // Find where footer sections start
      for (let i = 0; i < sectionData.length; i++) {
        if (footerSections.includes(sectionData[i].type)) {
          footerStartIndex = i;
          break;
        }
      }

      // Improved pagination logic
      sectionData.forEach((section, index) => {
        const isFooterSection = footerSections.includes(section.type);
        const sectionHeightWithBuffer = section.height + marginPx * 0.7; // Add small buffer

        // If this is the start of footer sections, check if they fit on current page
        if (index === footerStartIndex && footerStartIndex >= 0) {
          const remainingFooterSections = sectionData.slice(footerStartIndex);
          const totalFooterHeight = remainingFooterSections.reduce(
            (sum, s) => sum + s.height,
            0
          );
          const totalFooterHeightWithBuffer =
            totalFooterHeight + marginPx * 1.5; // Extra buffer for footer

          // If footer doesn't fit, start new page
          if (
            currentPageHeight + totalFooterHeightWithBuffer > pageHeightPx &&
            currentPageContent.length > 0
          ) {
            pages.push({
              content: [...currentPageContent],
              height: currentPageHeight,
            });
            currentPageContent = [];
            currentPageHeight = 0;
          }
        }

        // Check if section fits on current page
        if (
          currentPageHeight + sectionHeightWithBuffer > pageHeightPx &&
          currentPageContent.length > 0
        ) {
          // Don't split footer sections or if section is too close to page end
          if (!isFooterSection || currentPageHeight > pageHeightPx * 0.7) {
            pages.push({
              content: [...currentPageContent],
              height: currentPageHeight,
            });
            currentPageContent = [section];
            currentPageHeight = section.height;
          } else {
            currentPageContent.push(section);
            currentPageHeight += section.height;
          }
        } else {
          currentPageContent.push(section);
          currentPageHeight += section.height;
        }
      });

      // Add the last page
      if (currentPageContent.length > 0) {
        pages.push({
          content: currentPageContent,
          height: currentPageHeight,
        });
      }

      // If no sections found, fall back to simple pagination
      if (pages.length === 0) {
        const contentHeight = tempContainer.scrollHeight;
        const numberOfPages = Math.ceil(contentHeight / pageHeightPx);

        for (let i = 0; i < numberOfPages; i++) {
          pages.push({
            yOffset: i * pageHeightPx,
            height: Math.min(pageHeightPx, contentHeight - i * pageHeightPx),
          });
        }
      }

      // Create PDF with standard margins
      const pdf = new jsPDF("p", "mm", "a4");

      for (let pageIndex = 0; pageIndex < pages.length; pageIndex++) {
        if (pageIndex > 0) {
          pdf.addPage();
        }

        const page = pages[pageIndex];

        // Calculate canvas options with consistent scaling
        let canvasOptions = {
          scale: templateNumber === 2 ? 2.2 : 1.8, // Improved scaling
          useCORS: true,
          allowTaint: true,
          logging: false,
          backgroundColor: "#ffffff",
          width: tempContainer.scrollWidth,
          windowWidth: 794, // A4 width in pixels at 96 DPI
        };

        if (page.yOffset !== undefined) {
          // Simple pagination fallback
          canvasOptions.height = page.height;
          canvasOptions.y = page.yOffset;
          canvasOptions.windowHeight = page.height;
        } else {
          // Section-based pagination with improved positioning
          const startY = Math.max(0, page.content[0].top - marginPx * 0.3);
          const endY =
            page.content[page.content.length - 1].top +
            page.content[page.content.length - 1].height +
            marginPx * 0.3;
          canvasOptions.height = endY - startY;
          canvasOptions.y = startY;
          canvasOptions.windowHeight = endY - startY;
        }

        const canvas = await html2canvas(tempContainer, canvasOptions);
        const imgData = canvas.toDataURL("image/png");

        // Calculate dimensions for PDF with standard margins
        const pdfWidth = a4Width - pageMargin * 2;
        const pdfHeight = Math.min(
          (canvasOptions.height * pdfWidth) / tempContainer.scrollWidth,
          a4Height - pageMargin * 2
        );

        pdf.addImage(
          imgData,
          "PNG",
          pageMargin,
          pageMargin,
          pdfWidth,
          pdfHeight,
          undefined,
          "FAST"
        );
      }

      const { number, date, paymentDate } = invoiceData.invoice;
      const { name: companyName } = invoiceData.yourCompany;
      const { name: billToName } = invoiceData.billTo;
      const timestamp = new Date().getTime();

      let fileName;
      switch (templateNumber) {
        case 1:
          fileName = `${number}.pdf`;
          break;
        case 2:
          fileName = `${companyName}_${number}.pdf`;
          break;
        case 3:
          fileName = `${companyName}.pdf`;
          break;
        case 4:
          fileName = `${date}.pdf`;
          break;
        case 5:
          fileName = `${number}-${date}.pdf`;
          break;
        case 6:
          fileName = `invoice_${timestamp}.pdf`;
          break;
        case 7:
          fileName = `Invoice_${number}.pdf`;
          break;
        case 8:
          fileName = `Invoice_${billToName}.pdf`;
          break;
        case 9:
          fileName = `IN-${date}.pdf`;
          break;
        default:
          fileName = `invoice_template_${templateNumber}.pdf`;
      }

      pdf.save(fileName);

      // Cleanup
      root.unmount();
      document.body.removeChild(tempContainer);
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

export const printInvoice = () => {
  window.print();
};
