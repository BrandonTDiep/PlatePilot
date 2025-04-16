# -------------------------------------------------------------------------
# AUTHOR: Brandon Diep
# FILENAME: roc_curve.py
# SPECIFICATION: Read the file cheat_data.csv, split the training and test data according to the ratio provided, and compute the ROC curve for a decision tree classifier
# FOR: CS 5990 (Advanced Data Mining) - Assignment #3
# TIME SPENT: 30 mins
# -----------------------------------------------------------*/

#IMPORTANT NOTE: YOU HAVE TO WORK WITH THE PYTHON LIBRARIES numpy AND pandas to complete this code.

#importing some Python libraries
from sklearn import tree
from sklearn.model_selection import train_test_split
from sklearn.metrics import roc_curve
from sklearn.metrics import roc_auc_score
from matplotlib import pyplot
import numpy as np
import pandas as pd

# read the dataset cheat_data.csv and prepare the data_training numpy array
# --> add your Python code here
# data_training = ?
df = pd.read_csv('cheat_data.csv', sep=',', header=0)   #reading a dataset eliminating the header (Pandas library)
data_training = np.array(df.values) #creating a training matrix without the id (NumPy library)

# transform the original training features to numbers and add them to the 5D array X. For instance, Refund = 1, Single = 1, Divorced = 0, Married = 0,
# Taxable Income = 125, so X = [[1, 1, 0, 0, 125], [0, 0, 1, 0, 100], ...]]. The feature Marital Status must be one-hot-encoded and Taxable Income must
# be converted to a float.
# --> add your Python code here
# X = ?
X = []
Y = []
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


    # transform the original training classes to numbers and add them to the vector y. For instance Yes = 1, No = 0, so Y = [1, 1, 0, 0, ...]
    # --> add your Python code here
    # y = ?
    if data[3] == 'Yes':
        cheat = 1
    else:
        cheat = 0
    Y.append(cheat)

X = np.array(X)
Y = np.array(Y)



# split into train/test sets using 30% for test
# --> add your Python code here
trainX, testX, trainy, testy = train_test_split(X, Y, test_size = 0.3)

# generate random thresholds for a no-skill prediction (random classifier)
# --> add your Python code here
# ns_probs = ?
ns_probs = np.random.rand(len(testy))

# fit a decision tree model by using entropy with max depth = 2
clf = tree.DecisionTreeClassifier(criterion = 'entropy', max_depth=2)
clf = clf.fit(trainX, trainy)

# predict probabilities for all test samples (scores)
dt_probs = clf.predict_proba(testX)

# keep probabilities for the positive outcome only
# --> add your Python code here
# dt_probs = ?
dt_probs = dt_probs[:, 1]

# calculate scores by using both classifiers (no skilled and decision tree)
ns_auc = roc_auc_score(testy, ns_probs)
dt_auc = roc_auc_score(testy, dt_probs)

# summarize scores
print('No Skill: ROC AUC=%.3f' % (ns_auc))
print('Decision Tree: ROC AUC=%.3f' % (dt_auc))

# calculate roc curves
ns_fpr, ns_tpr, _ = roc_curve(testy, ns_probs)
dt_fpr, dt_tpr, _ = roc_curve(testy, dt_probs)

# plot the roc curve for the model
pyplot.plot(ns_fpr, ns_tpr, linestyle='--', label='No Skill')
pyplot.plot(dt_fpr, dt_tpr, marker='.', label='Decision Tree')

# axis labels
pyplot.xlabel('False Positive Rate')
pyplot.ylabel('True Positive Rate')

# show the legend
pyplot.legend()

# show the plot
pyplot.show()