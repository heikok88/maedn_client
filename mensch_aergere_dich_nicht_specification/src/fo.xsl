<?xml version='1.0'?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:fo="http://www.w3.org/1999/XSL/Format"
  xmlns:l="http://docbook.sourceforge.net/xmlns/l10n/1.0"
  version="1.0">
  
  <!-- import FO stylesheet -->
  <xsl:import href="http://docbook.sourceforge.net/release/xsl/current/fo/docbook.xsl"/>
  
  <!-- set paper size to A4 -->
  <xsl:param name="paper.type">A4</xsl:param>
  
  <!-- enable numbering on sections -->
  <xsl:param name="section.autolabel">1</xsl:param>
  
  <!-- do not generate a table of contents -->
  <!--<xsl:param name="generate.toc">nop</xsl:param>-->
  
  <!-- body indention -->
  <xsl:param name="body.start.indent">0pt</xsl:param>
  
  <!-- space before and after section titles -->
  <xsl:attribute-set name="section.title.properties">
    <xsl:attribute name="padding-top">16pt</xsl:attribute>
    <xsl:attribute name="padding-bottom">6pt</xsl:attribute>
  </xsl:attribute-set>
  
  
  
  <!-- font sizes of section titles -->
  <xsl:attribute-set name="section.title.level1.properties">
    <xsl:attribute name="font-size">
      <xsl:value-of select="$body.font.master * 1.7"></xsl:value-of>
      <xsl:text>pt</xsl:text>
    </xsl:attribute>
  </xsl:attribute-set>
  
  <xsl:attribute-set name="section.title.level2.properties">
    <xsl:attribute name="font-size">
      <xsl:value-of select="$body.font.master * 1.5"></xsl:value-of>
      <xsl:text>pt</xsl:text>
    </xsl:attribute>
  </xsl:attribute-set>
  
  <xsl:attribute-set name="section.title.level3.properties">
    <xsl:attribute name="font-size">
      <xsl:value-of select="$body.font.master * 1.3"></xsl:value-of>
      <xsl:text>pt</xsl:text>
    </xsl:attribute>
  </xsl:attribute-set>
  
  <xsl:attribute-set name="section.title.level4.properties">
    <xsl:attribute name="font-size">
      <xsl:value-of select="$body.font.master * 1.15"></xsl:value-of>
      <xsl:text>pt</xsl:text>
    </xsl:attribute>
  </xsl:attribute-set>
  
  <xsl:attribute-set name="section.title.level5.properties">
    <xsl:attribute name="font-size">
      <xsl:value-of select="$body.font.master * 1.15"></xsl:value-of>
      <xsl:text>pt</xsl:text>
    </xsl:attribute>
  </xsl:attribute-set>
  
  <xsl:attribute-set name="section.title.level6.properties">
    <xsl:attribute name="font-size">
      <xsl:value-of select="$body.font.master * 1.15"></xsl:value-of>
      <xsl:text>pt</xsl:text>
    </xsl:attribute>
  </xsl:attribute-set>
</xsl:stylesheet>