import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import Markdown from 'react-native-markdown-display';

interface DetailedNutrition {
    totalFat: string;
    saturatedFat: string;
    transFat: string;
}

interface RecommendationChartProps {
    analysisResult: string;
    calories: string;
    protein: number;
    carbs: number;
    fat: number;
    detailedNutrition: DetailedNutrition;
}

const RecommendationChart: React.FC<RecommendationChartProps> = ({
    analysisResult,
    calories,
    protein,
    carbs,
    fat,
    detailedNutrition
}) => {
    const screenWidth = Dimensions.get('window').width;

    // Data for chart dynamically based on props
    const other = 100 - (protein+carbs+fat)
    const chartData = [
        { name: 'Protein', population: protein, color: '#4CAF50', legendFontColor: '#7F7F7F', legendFontSize: 15 },
        { name: 'Carbs', population: other, color: '#FFC107', legendFontColor: '#7F7F7F', legendFontSize: 15 },
        { name: 'Fat', population: fat, color: '#F44336', legendFontColor: '#7F7F7F', legendFontSize: 15 },
        { name: 'Other', population: carbs, color: '#607D8B', legendFontColor: '#7F7F7F', legendFontSize: 15 }
    ];

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>HEALTHY CHART</Text>
            <Text style={styles.calories}>{calories} CALORIES</Text>

            {/* Nutrition Pie Chart */}
            <PieChart
                data={chartData}
                width={screenWidth - 20}
                height={220}
                chartConfig={{
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                }}
                accessor={"population"}
                backgroundColor={"transparent"}
                paddingLeft={"15"}
                absolute
            />

            {/* Display Detailed Nutrition Data */}
            <View style={styles.detailsContainer}>
                <Text style={styles.detailTitle}>DETAILED NUTRITION DATA</Text>
                <Text style={styles.detailText}>Total Fat: {detailedNutrition.totalFat}</Text>
                <Text style={styles.detailText}>Saturated Fat: {detailedNutrition.saturatedFat}</Text>
                <Text style={styles.detailText}>Trans Fat: {detailedNutrition.transFat}</Text>
            </View>

            {/* Recommendations Section */}
            {analysisResult && (
                <View style={styles.recommendationContainer}>
                    <Text style={styles.recommendationTitle}>Recommendations</Text>
                    <Markdown style={styles}>
                        {analysisResult}
                    </Markdown>
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        alignItems: 'center',
        padding: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    calories: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
    },
    detailsContainer: {
        width: '100%',
        marginVertical: 20,
    },
    detailTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    detailText: {
        fontSize: 14,
        color: '#333',
    },
    recommendationContainer: {
        width: '100%',
        marginTop: 20,
        padding: 15,
        backgroundColor: '#f0f4f7',
        borderRadius: 8,
    },
    recommendationTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    markdown: {
        fontSize: 14,
        color: '#333',
        lineHeight: 22,
    },
});

export default RecommendationChart;
