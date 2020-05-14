#include <opencv2/core.hpp>
#include <opencv2/imgcodecs.hpp>
#include <opencv2/highgui.hpp>
#include <opencv2/imgproc/imgproc.hpp>
#include <iostream>
using namespace cv;
using namespace std;
// Vec3b bgr2hsv(Vec3b pixel)
// {
// 	Mat bgr = Mat(1, 1, CV_8UC3, pixel);
// 	Mat hsv;
// 	cvtColor(bgr, hsv, COLOR_BGR2HSV);
// 	return hsv.at<Vec3b>(0, 0);
// }
// Vec3b hsv2bgr(Vec3b pixel)
// {
// 	Mat hsv = Mat(1, 1, CV_8UC3, pixel);
// 	Mat rgb;
// 	cvtColor(hsv, rgb, COLOR_HSV2BGR);
// 	return rgb.at<Vec3b>(0, 0);
// }

int main( int argc, char** argv )
{
    if( argc < 4)
    {
        cout << "usage: file #colors name\n";
        exit(1);
    }
    Mat image;
    Mat mask[7];
    image = imread(argv[1], IMREAD_COLOR); // Read the file
    String name = argv[3];

    vector<Mat> channel(4);

    split(image, channel);
    
    vector<Vec3b> baseColors = {     Vec3b(0, 0, 255),     Vec3b(0, 255, 0),     Vec3b(0, 255, 255),   Vec3b(255, 0, 0),     Vec3b(255, 0, 255),   Vec3b(255, 255, 0),   Vec3b(255/2, 0, 255/2)};
    vector<Vec3b> colorsThreshMin = {Vec3b(0, 0, 120),     Vec3b(0, 120, 0),     Vec3b(0, 120, 120),   Vec3b(120, 0, 0),     Vec3b(120, 0, 120),   Vec3b(120, 120, 0),   Vec3b(120/2, 120, 120/2)};
    vector<Vec3b> colorsThreshMax = {Vec3b(120, 120, 255), Vec3b(120, 255, 120), Vec3b(120, 255, 255), Vec3b(255, 120, 120), Vec3b(255, 120, 255), Vec3b(255, 255, 120), Vec3b(255/2, 120, 255/2)};
    
    int colors = stoi(argv[2]);
    vector<cv::Vec3b> subcolors[colors];
    for (int i = 0; i < colors; ++i)
    {
        subcolors[i].push_back(baseColors[i]);
        Mat tmp = Mat::zeros(image.size(), IMREAD_COLOR);
        inRange(image, colorsThreshMin[i], colorsThreshMax[i], mask[i]);
 
        bitwise_and(image, image, tmp, mask[i]);

        cout << colorsThreshMin[i] << " " << colorsThreshMax[i] << "\n";


        for (int x = 0; x < image.cols; x++)
        {
            for (int y = 0; y < image.rows; y++)
            {
                if (tmp.at<cv::Vec3b>(y,x) != cv::Vec3b(0,0,0) && find(subcolors[i].begin(), subcolors[i].end(), tmp.at<cv::Vec3b>(y,x)) == subcolors[i].end())
                {
                    subcolors[i].push_back(tmp.at<cv::Vec3b>(y,x));
                }
            }
        }
        
        Mat palette = Mat::zeros(subcolors[i].size(), 1, image.type());
        for (__SIZE_TYPE__ j = 0; j < subcolors[i].size(); ++j)
        {
            palette.at<Vec3b>(j,0) = subcolors[i][j];
        }
        imwrite(name + "//" + to_string(i) + "palette.png", palette);
        imwrite(name + "//" + to_string(i) + "mask.png", mask[i]);
    }
    imwrite(name + "//" + "base.png", image);
     
    return 0;
}
