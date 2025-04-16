# -------------------------------------------------------------------------
# AUTHOR: Brandon Diep
# FILENAME: decision_tree.py
# SPECIFICATION: Train, test, and output the performance of the 3 models created by using each training set on the test set provided
# FOR: CS 5990 (Advanced Data Mining) - Assignment #3
# TIME SPENT: 8 hrs
# -----------------------------------------------------------*/

#IMPORTANT NOTE: YOU HAVE TO WORK WITH THE PYTHON LIBRARIES numpy AND pandas to complete this code.

#importing some Python libraries
from sklearn import tree
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

dataSets = ['cheat_training_1.csv', 'cheat_training_2.csv', 'cheat_training_3.csv']

for ds in dataSets:

    X = []
    Y = []

    df = pd.read_csv(ds, sep=',', header=0)   #reading a dataset eliminating the header (Pandas library)
    data_training = np.array(df.values)[:,1:] #creating a training matrix without the id (NumPy library)

    #transform the original training features to numbers and add them to the 5D array X. For instance, Refund = 1, Single = 1, Divorced = 0, Married = 0,
    #Taxable Income = 125, so X = [[1, 1, 0, 0, 125], [2, 0, 1, 0, 100], ...]]. The feature Marital Status must be one-hot-encoded and Taxable Income must
    #be converted to a float.
    for data in data_training:
        if data[0] == 'Yes':
            refund = 1
        else:
            refund = 0

        if data[1] == 'Single':
            single = 1
            divorced = 0
            married = 0
        elif data[1] == 'Divorced':
            single = 0
            divorced = 1
            married = 0
        else:
            single = 0
            divorced = 0
            married = 1

        taxable_income = float(data[2].replace('k', ''))

        # X =
        X.append([refund, single ,divorced, married, taxable_income])


        #transform the original training classes to numbers and add them to the vector Y. For instance Yes = 1, No = 2, so Y = [1, 1, 2, 2, ...]
        #--> add your Python code here
        # Y =
        if data[3] == 'Yes':
            cheat = 1
        else:
            cheat = 2
        Y.append(cheat)

    X = np.array(X)
    Y = np.array(Y)

    totalAccuracy = 0

    #loop your training and test tasks 10 times here
    for i in range (10):
        #fitting the decision tree to the data by using Gini index and no max_depth
        clf = tree.DecisionTreeClassifier(criterion = 'gini', max_depth=None)
        clf = clf.fit(X, Y)

        #plotting the decision tree
        tree.plot_tree(clf, feature_names=['Refund', 'Single', 'Divorced', 'Married', 'Taxable Income'], class_names=['Yes','No'], filled=True, rounded=True)
        plt.show()

        #read the test data and add this data to data_test NumPy
        #--> add your Python code here
        df_test = pd.read_csv('cheat_test.csv', sep=',', header=0)   #reading a dataset eliminating the header (Pandas library)
        data_test = np.array(df_test.values)[:,1:] #creating a training matrix without the id (NumPy library)

        #transform the features of the test instances to numbers following the same strategy done during training, and then use the decision tree to make the class prediction. For instance:
        #class_predicted = clf.predict([[1, 0, 1, 0, 115]])[0], where [0] is used to get an integer as the predicted class label so that you can compare it with the true label
        #--> add your Python code here
        numCorrect = 0
        total = 0

        for data in data_test:
            if data[0] == 'Yes':
                refund = 1
            else:
                refund = 0
        
            if data[1] == 'Single':
                single = 1
                divorced = 0
                married = 0
            elif data[1] == 'Divorced':
                single = 0
                divorced = 1
                married = 0
            else:
                single = 0
                divorced = 0
                married = 1

            taxable_income = float(data[2].replace('k', ''))



            #compare the prediction with the true label (located at data[3]) of the test instance to start calculating the model accuracy.
            #--> add your Python code here
            if data[3] == 'Yes':
                trueLabel = 1
            else:
                trueLabel = 2
            
            predictLabel = clf.predict([[refund, single, divorced, married, taxable_income]])[0]

            if predictLabel == trueLabel:
                numCorrect += 1
            total += 1

        #find the average accuracy of this model during the 10 runs (training and test set)
        #--> add your Python code here
        accuracy = numCorrect / total
        totalAccuracy += accuracy

    #print the accuracy of this model during the 10 runs (training and test set).
    #your output should be something like that: final accuracy when training on cheat_training_1.csv: 0.2
    #--> add your Python code here
    
    avgAccuracy = totalAccuracy / 10
    print(f'final accuracy when training on {ds}: {avgAccuracy:.2f}')



