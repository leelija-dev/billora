import { generateProfessionalPDF } from './exports/pdfTemplate'
import { generateProfessionalWord } from './exports/wordTemplate'
import { exportToExcel } from './exports/excelTemplate'
import { printDashboard } from './exports/printTemplate'

export const handlePDFExport = async (data, callbacks) => {
  const { setExporting, setShowExportDropdown } = callbacks
  setExporting(true)
  try {
    await generateProfessionalPDF(data)
    setShowExportDropdown(false)
  } catch (error) {
    console.error('PDF generation failed:', error)
    alert('Failed to generate PDF. Please try again.')
  } finally {
    setExporting(false)
  }
}

export const handleWordExport = (data, callbacks) => {
  const { setExporting, setShowExportDropdown } = callbacks
  setExporting(true)
  try {
    generateProfessionalWord(data)
    setShowExportDropdown(false)
  } catch (error) {
    console.error('Word export failed:', error)
    alert('Failed to export to Word. Please try again.')
  } finally {
    setExporting(false)
  }
}

export const handleExcelExport = (data, callbacks) => {
  const { setExporting, setShowExportDropdown } = callbacks
  setExporting(true)
  try {
    exportToExcel(data)
    setShowExportDropdown(false)
  } catch (error) {
    console.error('Excel export failed:', error)
    alert('Failed to export to Excel. Please try again.')
  } finally {
    setExporting(false)
  }
}

export const handlePrint = async (data, callbacks) => {
  const { setIsPrinting } = callbacks
  setIsPrinting(true)
  try {
    await printDashboard(data)
  } catch (error) {
    console.error('Print failed:', error)
    alert('Failed to print. Please try again.')
  } finally {
    setIsPrinting(false)
  }
}