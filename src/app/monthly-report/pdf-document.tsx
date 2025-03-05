"use client";

import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#112233',
    borderBottomStyle: 'solid',
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#112233',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#112233',
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    borderBottomStyle: 'solid',
  },
  text: {
    fontSize: 12,
    marginBottom: 10,
    lineHeight: 1.5,
  },
  table: {
    display: 'flex',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#EEEEEE',
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    borderBottomStyle: 'solid',
  },
  tableHeader: {
    backgroundColor: '#F5F5F5',
  },
  tableCell: {
    padding: 8,
    fontSize: 10,
  },
  tableCellHeader: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  metricsCell: {
    width: '33%',
  },
  productsNameCell: {
    width: '40%',
  },
  productsDataCell: {
    width: '20%',
  },
  graphContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  graphPlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: '#F5F5F5',
    marginBottom: 10,
  },
  graphCaption: {
    fontSize: 10,
    color: '#666666',
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    fontSize: 10,
    color: '#666666',
    textAlign: 'center',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    borderTopStyle: 'solid',
    paddingTop: 10,
  },
  positive: {
    color: '#22C55E',
  },
  negative: {
    color: '#EF4444',
  },
  neutral: {
    color: '#666666',
  },
});

// PDF Document Component
export const PDFDocument = ({ data }: { data: any }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Monthly Performance Report</Text>
        <Text style={styles.subtitle}>{data.month} {data.year} - 10X Engineered Materials</Text>
      </View>

      {/* Executive Summary */}
      {data.includeExecutiveSummary && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Executive Summary</Text>
          <Text style={styles.text}>{data.executiveSummary}</Text>
        </View>
      )}

      {/* Performance Metrics */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Key Performance Metrics</Text>
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <View style={[styles.tableCell, styles.metricsCell]}>
              <Text style={styles.tableCellHeader}>Metric</Text>
            </View>
            <View style={[styles.tableCell, styles.metricsCell]}>
              <Text style={styles.tableCellHeader}>Value</Text>
            </View>
            <View style={[styles.tableCell, styles.metricsCell]}>
              <Text style={styles.tableCellHeader}>Change</Text>
            </View>
          </View>
          {data.metrics.map((metric: any, index: number) => (
            <View key={index} style={styles.tableRow}>
              <View style={[styles.tableCell, styles.metricsCell]}>
                <Text>{metric.name}</Text>
              </View>
              <View style={[styles.tableCell, styles.metricsCell]}>
                <Text>{metric.value}</Text>
              </View>
              <View style={[styles.tableCell, styles.metricsCell]}>
                <Text 
                  style={
                    metric.change.startsWith('+') ? styles.positive : 
                    metric.change.startsWith('-') ? styles.negative : 
                    styles.neutral
                  }
                >
                  {metric.change}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Graphs Section */}
      {data.includeGraphs && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Performance Graphs</Text>
          <View style={styles.graphContainer}>
            <View style={styles.graphPlaceholder}>
              <Text style={{ textAlign: 'center', paddingTop: 90 }}>Revenue Trend Graph</Text>
            </View>
            <Text style={styles.graphCaption}>Monthly Revenue Trend - {data.year}</Text>
          </View>
          <View style={styles.graphContainer}>
            <View style={styles.graphPlaceholder}>
              <Text style={{ textAlign: 'center', paddingTop: 90 }}>Orders Trend Graph</Text>
            </View>
            <Text style={styles.graphCaption}>Monthly Orders Trend - {data.year}</Text>
          </View>
        </View>
      )}

      {/* Product Performance */}
      {data.includeRawData && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Product Performance</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <View style={[styles.tableCell, styles.productsNameCell]}>
                <Text style={styles.tableCellHeader}>Product</Text>
              </View>
              <View style={[styles.tableCell, styles.productsDataCell]}>
                <Text style={styles.tableCellHeader}>Revenue</Text>
              </View>
              <View style={[styles.tableCell, styles.productsDataCell]}>
                <Text style={styles.tableCellHeader}>Units</Text>
              </View>
              <View style={[styles.tableCell, styles.productsDataCell]}>
                <Text style={styles.tableCellHeader}>Avg. Price</Text>
              </View>
            </View>
            {data.products.map((product: any, index: number) => (
              <View key={index} style={styles.tableRow}>
                <View style={[styles.tableCell, styles.productsNameCell]}>
                  <Text>{product.name}</Text>
                </View>
                <View style={[styles.tableCell, styles.productsDataCell]}>
                  <Text>{product.revenue}</Text>
                </View>
                <View style={[styles.tableCell, styles.productsDataCell]}>
                  <Text>{product.units}</Text>
                </View>
                <View style={[styles.tableCell, styles.productsDataCell]}>
                  <Text>{product.avgPrice}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Footer */}
      <View style={styles.footer}>
        <Text>10X Engineered Materials - Confidential - {data.month} {data.year} Report</Text>
      </View>
    </Page>
  </Document>
);
